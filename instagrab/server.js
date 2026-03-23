const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const archiver = require("archiver");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "instagram120.p.rapidapi.com";
const RAPIDAPI_BASE_URL = process.env.RAPIDAPI_BASE_URL || `https://${RAPIDAPI_HOST}`;

const PROFILE_ENDPOINT = process.env.PROFILE_ENDPOINT || "/api/instagram/profile";
const PROFILE_METHOD = String(process.env.PROFILE_METHOD || "POST").toUpperCase();
const POSTS_ENDPOINT = process.env.POSTS_ENDPOINT || "/api/instagram/posts";
const POSTS_METHOD = String(process.env.POSTS_METHOD || "POST").toUpperCase();
const HIGHLIGHTS_ENDPOINT = process.env.HIGHLIGHTS_ENDPOINT || "/api/instagram/highlights";
const HIGHLIGHTS_METHOD = String(process.env.HIGHLIGHTS_METHOD || "POST").toUpperCase();
const STORIES_ENDPOINT = process.env.STORIES_ENDPOINT || "/api/instagram/stories";
const STORIES_METHOD = String(process.env.STORIES_METHOD || "POST").toUpperCase();
const HIGHLIGHT_STORIES_ENDPOINT = process.env.HIGHLIGHT_STORIES_ENDPOINT || "/api/instagram/highlightStories";
const HIGHLIGHT_STORIES_METHOD = String(process.env.HIGHLIGHT_STORIES_METHOD || "POST").toUpperCase();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));

function pick(obj, paths, fallback = null) {
  for (const path of paths) {
    const parts = path.split(".");
    let value = obj;
    for (const key of parts) {
      if (value == null || !(key in value)) {
        value = undefined;
        break;
      }
      value = value[key];
    }
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return fallback;
}

function toInt(value, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function toIsoDate(value) {
  if (!value) return null;
  if (typeof value === "number") {
    const ms = value < 1000000000000 ? value * 1000 : value;
    return new Date(ms).toISOString();
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function unwrapDataContainer(raw) {
  return raw?.data || raw?.result || raw?.response || raw || {};
}

function normalizeProfile(raw) {
  const base = unwrapDataContainer(raw);
  const data = base?.user || base?.owner || base;
  return {
    id: pick(data, ["id", "pk", "user.id"]),
    username: pick(data, ["username", "user.username"], ""),
    fullName: pick(data, ["full_name", "fullName", "user.full_name"], ""),
    biography: pick(data, ["biography", "bio", "user.biography"], ""),
    followerCount: toInt(pick(data, ["follower_count", "followers", "edge_followed_by.count", "user.follower_count"])),
    followingCount: toInt(pick(data, ["following_count", "followings", "edge_follow.count", "user.following_count"])),
    postCount: toInt(pick(data, ["media_count", "post_count", "edge_owner_to_timeline_media.count", "user.media_count"])),
    profilePicUrl: pick(data, ["hd_profile_pic_url_info.url", "profile_pic_url_hd", "profile_pic_url", "user.profile_pic_url"]),
    externalUrl: pick(data, ["external_url", "bio_links.0.url", "website"]),
    isVerified: Boolean(pick(data, ["is_verified", "verified"], false)),
    isPrivate: Boolean(pick(data, ["is_private", "private"], false))
  };
}

function profileFromPosts(raw, usernameFallback = "") {
  const data = unwrapDataContainer(raw);
  const firstEdgeNode = pick(data, ["edges.0.node", "items.0.node", "items.0"], {}) || {};
  const owner = pick(firstEdgeNode, ["owner", "user"], {}) || {};

  return {
    id: pick(data, ["user.id", "owner.id", "profile.id", "id"], owner?.id || null),
    username: pick(data, ["username", "user.username", "owner.username", "profile.username"], owner?.username || usernameFallback),
    fullName: pick(data, ["full_name", "user.full_name", "owner.full_name", "profile.full_name"], owner?.full_name || ""),
    biography: pick(data, ["biography", "user.biography", "profile.biography"], ""),
    followerCount: toInt(pick(data, ["follower_count", "user.follower_count", "profile.follower_count"])),
    followingCount: toInt(pick(data, ["following_count", "user.following_count", "profile.following_count"])),
    postCount: toInt(pick(data, ["post_count", "user.media_count", "profile.post_count"])),
    profilePicUrl: pick(data, ["profile_pic_url", "user.profile_pic_url", "profile.profile_pic_url"], owner?.profile_pic_url || null),
    externalUrl: pick(data, ["external_url", "user.external_url", "profile.external_url"], null),
    isVerified: Boolean(pick(data, ["is_verified", "user.is_verified", "profile.is_verified"], owner?.is_verified || false)),
    isPrivate: Boolean(pick(data, ["is_private", "user.is_private", "profile.is_private"], owner?.is_private || false))
  };
}

function normalizeChild(child, fallbackId) {
  const mediaType = pick(child, ["media_type", "type"]);
  const isVideo = mediaType === 2 || mediaType === "video" || Boolean(pick(child, ["is_video", "video_url"]));

  return {
    id: String(pick(child, ["id", "pk"], `${fallbackId}-${Math.random().toString(36).slice(2, 8)}`)),
    type: isVideo ? "video" : "image",
    thumbnailUrl: pick(child, ["thumbnail_url", "display_url", "image_versions2.candidates.0.url"]),
    mediaUrl: pick(child, ["display_url", "image_versions2.candidates.0.url", "image_url", "url"]),
    videoUrl: pick(child, ["video_url", "video_versions.0.url"])
  };
}

function normalizeMediaItem(item) {
  const mediaType = pick(item, ["media_type", "type", "node.__typename"]);
  const isCarousel = mediaType === 8 || mediaType === "GraphSidecar" || Array.isArray(item?.carousel_media);
  const isVideo = mediaType === 2 || mediaType === "GraphVideo" || Boolean(pick(item, ["is_video", "video_url", "video_versions.0.url"]));

  const id = String(pick(item, ["id", "pk", "code"], Math.random().toString(36).slice(2)));
  const caption = pick(item, ["caption.text", "caption", "edge_media_to_caption.edges.0.node.text"], "");
  const childrenRaw = pick(item, ["carousel_media", "children", "edge_sidecar_to_children.edges"], []);
  const childList = Array.isArray(childrenRaw)
    ? childrenRaw.map((child) => normalizeChild(child?.node || child, id))
    : [];

  return {
    id,
    shortcode: pick(item, ["code", "shortcode"]),
    type: isCarousel ? "carousel" : (isVideo ? "video" : "image"),
    thumbnailUrl: pick(item, ["thumbnail_url", "display_url", "image_versions2.candidates.0.url"]),
    mediaUrl: pick(item, ["display_url", "image_versions2.candidates.0.url", "image_url"]),
    videoUrl: pick(item, ["video_url", "video_versions.0.url"]),
    children: childList,
    likeCount: toInt(pick(item, ["like_count", "edge_liked_by.count", "edge_media_preview_like.count"])),
    commentCount: toInt(pick(item, ["comment_count", "edge_media_to_comment.count"])),
    caption,
    takenAt: toIsoDate(pick(item, ["taken_at", "taken_at_timestamp", "date"])),
    permalink: pick(item, ["permalink", "link", "shortcode"], null)
  };
}

function flattenMedia(raw) {
  const data = unwrapDataContainer(raw);
  const candidates = [
    data?.edges,
    data?.items,
    data?.posts,
    data?.medias,
    data?.edges,
    data?.edge_owner_to_timeline_media?.edges,
    data?.user?.edge_owner_to_timeline_media?.edges
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate.map((item) => normalizeMediaItem(item?.node || item));
    }
  }

  return [];
}

function normalizeHighlights(raw) {
  const data = unwrapDataContainer(raw);
  if (Array.isArray(data)) {
    return data.map((entry) => ({
      id: String(pick(entry, ["id", "pk", "title"], Math.random().toString(36).slice(2))),
      title: pick(entry, ["title", "name"], "Highlight"),
      coverUrl: pick(entry, ["cover_media.cropped_image_version.url", "cover_url", "thumbnail_url"]),
      items: []
    }));
  }

  const items = pick(data, ["highlights", "items", "tray"], []);
  if (!Array.isArray(items)) return [];

  return items.map((entry) => {
    const reels = pick(entry, ["items", "reels"], []);
    return {
      id: String(pick(entry, ["id", "pk", "title"], Math.random().toString(36).slice(2))),
      title: pick(entry, ["title", "name"], "Highlight"),
      coverUrl: pick(entry, ["cover_media.cropped_image_version.url", "cover_url", "thumbnail_url"]),
      items: Array.isArray(reels) ? reels.map((story) => normalizeMediaItem(story)) : []
    };
  });
}

function normalizeStories(raw) {
  const data = unwrapDataContainer(raw);
  if (Array.isArray(data)) {
    return data.map((item) => normalizeMediaItem(item));
  }

  const reels = pick(data, ["reels", "items"], []);
  if (Array.isArray(reels)) {
    return reels.flatMap((reel) => {
      const items = pick(reel, ["items"], []);
      if (Array.isArray(items)) {
        return items.map((item) => normalizeMediaItem(item));
      }
      return [normalizeMediaItem(reel)];
    });
  }

  return [];
}

async function attachHighlightStories(highlights) {
  if (!HIGHLIGHT_STORIES_ENDPOINT || !Array.isArray(highlights) || !highlights.length) {
    return { highlights, errors: [] };
  }

  const limited = highlights.slice(0, 20);
  const detailResults = await Promise.allSettled(
    limited.map((highlight) =>
      rapidRequest(HIGHLIGHT_STORIES_ENDPOINT, {
        method: HIGHLIGHT_STORIES_METHOD,
        query: HIGHLIGHT_STORIES_METHOD === "GET" ? { highlightId: highlight.id } : {},
        body: HIGHLIGHT_STORIES_METHOD === "GET" ? undefined : { highlightId: highlight.id }
      })
    )
  );

  const errors = [];
  const enriched = limited.map((highlight, index) => {
    const result = detailResults[index];
    if (result.status !== "fulfilled") {
      errors.push(buildFriendlyError(result.reason));
      return { ...highlight, items: [] };
    }

    return {
      ...highlight,
      items: normalizeStories(result.value)
    };
  });

  return {
    highlights: [...enriched, ...highlights.slice(limited.length)],
    errors
  };
}

async function rapidRequest(endpointPath, options = {}) {
  if (!RAPIDAPI_KEY) {
    throw new Error("Missing RAPIDAPI_KEY. Add it to .env.");
  }

  if (!endpointPath) {
    throw new Error("Missing endpoint configuration for RapidAPI request.");
  }

  const method = String(options.method || "GET").toUpperCase();
  const query = options.query || {};
  const requestBody = options.body;

  const url = new URL(endpointPath, RAPIDAPI_BASE_URL);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST
  };

  let payload;
  if (method !== "GET" && requestBody !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(requestBody);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: payload
  });

  const bodyText = await response.text();
  let responseBody;

  try {
    responseBody = JSON.parse(bodyText);
  } catch {
    responseBody = { message: bodyText };
  }

  if (!response.ok) {
    const message = responseBody?.message || responseBody?.error || `RapidAPI request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return responseBody;
}

function buildFriendlyError(error) {
  const text = String(error?.message || "Unknown error").toLowerCase();

  if (text.includes("private")) {
    return "This profile is private. Only public profiles are supported.";
  }
  if (text.includes("not found") || text.includes("does not exist")) {
    return "Profile not found. Double-check the username and try again.";
  }
  if (text.includes("rate") || text.includes("too many requests") || error?.status === 429) {
    return "Rate limited by provider. Wait a moment and try again.";
  }

  return error?.message || "Unexpected API failure.";
}

app.get("/api/profile/:username", async (req, res) => {
  const username = String(req.params.username || "").trim().replace(/^@/, "");
  const maxId = String(req.query.maxId || "").trim();
  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const postsResult = await rapidRequest(POSTS_ENDPOINT, {
      method: POSTS_METHOD,
      body: { username, maxId }
    });

    const settledRequests = await Promise.allSettled([
      PROFILE_ENDPOINT
        ? rapidRequest(PROFILE_ENDPOINT, {
            method: PROFILE_METHOD,
            query: PROFILE_METHOD === "GET" ? { username } : {},
            body: PROFILE_METHOD === "GET" ? undefined : { username }
          })
        : Promise.resolve(null),
      HIGHLIGHTS_ENDPOINT
        ? rapidRequest(HIGHLIGHTS_ENDPOINT, {
            method: HIGHLIGHTS_METHOD,
            query: HIGHLIGHTS_METHOD === "GET" ? { username } : {},
            body: HIGHLIGHTS_METHOD === "GET" ? undefined : { username }
          })
        : Promise.resolve(null),
      STORIES_ENDPOINT
        ? rapidRequest(STORIES_ENDPOINT, {
            method: STORIES_METHOD,
            query: STORIES_METHOD === "GET" ? { username } : {},
            body: STORIES_METHOD === "GET" ? undefined : { username }
          })
        : Promise.resolve(null)
    ]);

    const [profileResult, highlightsResult, storiesResult] = settledRequests;
    const profile = profileResult.status === "fulfilled" && profileResult.value
      ? normalizeProfile(profileResult.value)
      : profileFromPosts(postsResult, username);

    if (!profile.username) {
      profile.username = username;
    }

    if (profile.isPrivate) {
      return res.status(403).json({ error: "This profile is private. Only public profiles are supported." });
    }

    const media = flattenMedia(postsResult);
    const videos = media.filter((item) => item.type === "video" || item.children.some((child) => child.type === "video"));
    const highlightsBase = highlightsResult.status === "fulfilled" && highlightsResult.value
      ? normalizeHighlights(highlightsResult.value)
      : [];
    const highlightDetails = await attachHighlightStories(highlightsBase);
    const highlights = highlightDetails.highlights;
    const stories = storiesResult.status === "fulfilled" && storiesResult.value
      ? normalizeStories(storiesResult.value)
      : [];

    const nextMaxId = pick(postsResult, [
      "result.page_info.end_cursor",
      "data.page_info.end_cursor",
      "data.maxId",
      "data.nextMaxId",
      "pagination.next_max_id",
      "nextMaxId",
      "maxId"
    ], "");
    const hasMore = Boolean(nextMaxId);

    return res.json({
      profile,
      media,
      videos,
      highlights,
      stories,
      pagination: {
        maxId,
        nextMaxId,
        hasMore
      },
      warnings: [profileResult, highlightsResult, storiesResult]
        .filter((r) => r.status === "rejected")
        .map((r) => buildFriendlyError(r.reason))
        .concat(highlightDetails.errors)
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: buildFriendlyError(error) });
  }
});

app.get("/api/download", async (req, res) => {
  const targetUrl = req.query.url;
  const requestedName = req.query.filename;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing media URL." });
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(502).json({ error: "Unable to fetch media file." });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const safeName = String(requestedName || "media").replace(/[^a-z0-9._-]/gi, "_");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=\"${safeName}\"`);

    if (!response.body) {
      return res.status(500).json({ error: "No media stream available." });
    }

    for await (const chunk of response.body) {
      res.write(chunk);
    }
    return res.end();
  } catch {
    return res.status(500).json({ error: "Download failed." });
  }
});

app.post("/api/download/zip", async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) {
    return res.status(400).json({ error: "No items selected." });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=\"instagrab-media.zip\"");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", () => res.status(500).end());
  archive.pipe(res);

  for (const entry of items.slice(0, 100)) {
    const url = entry?.url;
    if (!url) continue;

    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const ext = response.headers.get("content-type")?.includes("video") ? "mp4" : "jpg";
      const filename = String(entry.filename || `media-${Date.now()}.${ext}`).replace(/[^a-z0-9._-]/gi, "_");
      const buffer = Buffer.from(await response.arrayBuffer());
      archive.append(buffer, { name: filename });
    } catch {
      // Ignore per-item failures and keep archive generation running.
    }
  }

  archive.finalize();
});

app.get("/api/health", (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Instagrab running on http://localhost:${PORT}`);
});
