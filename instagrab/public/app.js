const els = {
  searchForm: document.getElementById("searchForm"),
  usernameInput: document.getElementById("usernameInput"),
  statusArea: document.getElementById("statusArea"),
  profileSection: document.getElementById("profileSection"),
  contentSection: document.getElementById("contentSection"),
  gridArea: document.getElementById("gridArea"),
  tabButtons: Array.from(document.querySelectorAll(".tab-btn")),
  selectionCount: document.getElementById("selectionCount"),
  downloadSelected: document.getElementById("downloadSelected"),
  paginationBar: document.getElementById("paginationBar"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  pageInfo: document.getElementById("pageInfo"),
  loadMoreRemote: document.getElementById("loadMoreRemote"),
  modal: document.getElementById("mediaModal"),
  modalMediaArea: document.getElementById("modalMediaArea"),
  modalMeta: document.getElementById("modalMeta"),
  closeModal: document.getElementById("closeModal"),
  prevItem: document.getElementById("prevItem"),
  nextItem: document.getElementById("nextItem"),
  prevChild: document.getElementById("prevChild"),
  nextChild: document.getElementById("nextChild"),
  childNav: document.getElementById("childNav"),
  childIndexText: document.getElementById("childIndexText"),
  themeToggle: document.getElementById("themeToggle")
};

const state = {
  profile: null,
  posts: [],
  videos: [],
  highlights: [],
  stories: [],
  activeTab: "posts",
  selected: new Set(),
  currentPage: 1,
  itemsPerPage: 24,
  activeUsername: "",
  nextMaxId: "",
  hasMoreRemote: false,
  loadingMore: false,
  modalList: [],
  modalIndex: 0,
  modalChildIndex: 0
};

const numberFormatter = new Intl.NumberFormat();

function setStatus(message, type = "idle") {
  els.statusArea.textContent = message;
  els.statusArea.className = `status status-${type}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "Unknown date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

function getPrimaryMedia(item) {
  if (item.type === "highlight") {
    return {
      type: "image",
      mediaUrl: item.coverUrl,
      videoUrl: null,
      thumbnailUrl: item.coverUrl
    };
  }
  if (item.type === "carousel" && item.children?.length) {
    return item.children[0];
  }
  return {
    type: item.type,
    mediaUrl: item.mediaUrl,
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnailUrl
  };
}

function getDisplayList() {
  if (state.activeTab === "videos") return state.videos;
  if (state.activeTab === "highlights") {
    const highlightCards = state.highlights.map((highlight) => ({
      ...highlight,
      type: "highlight",
      id: `highlight-${highlight.id}`
    }));
    const storyCards = (state.stories || []).map((story) => ({
      ...story,
      __story: true
    }));
    return [...highlightCards, ...storyCards];
  }
  return state.posts;
}

function getPageMeta(list) {
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / state.itemsPerPage));
  state.currentPage = Math.min(Math.max(1, state.currentPage), totalPages);
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  return {
    totalItems,
    totalPages,
    start,
    paged: list.slice(start, end)
  };
}

function mediaBadgeText(item) {
  const badges = [];
  if (item.type === "video") badges.push("Video");
  if (item.type === "carousel") badges.push("Carousel");
  if (item.type === "highlight") badges.push("Highlight");
  if (item.__story) badges.push("Story");
  if (item.__highlightTitle) badges.push(item.__highlightTitle);
  return badges;
}

function renderProfile() {
  const p = state.profile;
  if (!p) return;

  const verified = p.isVerified ? " <span title=\"Verified\">check</span>" : "";
  const website = p.externalUrl
    ? `<a href="${p.externalUrl}" target="_blank" rel="noreferrer">${p.externalUrl}</a>`
    : "No website";

  els.profileSection.innerHTML = `
    <img src="${p.profilePicUrl || ""}" alt="${p.username} profile image" />
    <div>
      <h3>@${p.username}${verified}</h3>
      <div class="muted">${p.fullName || ""}</div>
      <p>${p.biography || "No bio provided."}</p>
      <div class="profile-stats">
        <span><strong>${numberFormatter.format(p.followerCount || 0)}</strong> followers</span>
        <span><strong>${numberFormatter.format(p.followingCount || 0)}</strong> following</span>
        <span><strong>${numberFormatter.format(p.postCount || state.posts.length)}</strong> posts</span>
      </div>
      <div class="muted">${website}</div>
    </div>
  `;

  els.profileSection.classList.remove("hidden");
}

function updateSelectionUi() {
  const count = state.selected.size;
  els.selectionCount.textContent = `${count} selected`;
  els.downloadSelected.disabled = count === 0;
}

function itemToDownloadEntries(item) {
  const entries = [];
  if (item.type === "highlight") {
    (item.items || []).forEach((story, index) => {
      entries.push({
        url: story.videoUrl || story.mediaUrl || story.thumbnailUrl,
        filename: `${item.id || "highlight"}-${index + 1}.${story.type === "video" ? "mp4" : "jpg"}`
      });
    });
    return entries;
  }

  if (item.type === "carousel" && item.children?.length) {
    item.children.forEach((child, index) => {
      entries.push({
        url: child.videoUrl || child.mediaUrl || child.thumbnailUrl,
        filename: `${item.id || "item"}-${index + 1}.${child.type === "video" ? "mp4" : "jpg"}`
      });
    });
    return entries;
  }

  entries.push({
    url: item.videoUrl || item.mediaUrl || item.thumbnailUrl,
    filename: `${item.id || "item"}.${item.type === "video" ? "mp4" : "jpg"}`
  });
  return entries;
}

function renderGrid() {
  const list = getDisplayList();
  const pageMeta = getPageMeta(list);
  const pagedList = pageMeta.paged;

  if (!list.length) {
    els.gridArea.innerHTML = "<p class=\"muted\">No content available for this tab.</p>";
    els.paginationBar.classList.add("hidden");
    return;
  }

  els.gridArea.innerHTML = pagedList
    .map((item, index) => {
      const media = getPrimaryMedia(item);
      const src = media.thumbnailUrl || media.mediaUrl || media.videoUrl || "";
      const selected = state.selected.has(item.id) ? "checked" : "";
      const badges = mediaBadgeText(item)
        .map((badge) => `<span class="badge">${badge}</span>`)
        .join("");
      const isHighlight = item.type === "highlight";
      const leftMeta = isHighlight
        ? `${numberFormatter.format((item.items || []).length)} items`
        : `like ${numberFormatter.format(item.likeCount || 0)}`;
      const rightMeta = isHighlight
        ? (item.title || "Highlight")
        : `comment ${numberFormatter.format(item.commentCount || 0)}`;

      const absoluteIndex = pageMeta.start + index;

      return `
        <article class="media-card" data-index="${absoluteIndex}" data-id="${item.id}">
          ${src ? `<img src="${src}" alt="media thumbnail" loading="lazy" />` : ""}
          <div class="badges">${badges}</div>
          <input class="select-checkbox" data-select-id="${item.id}" type="checkbox" ${selected} aria-label="Select media" />
          <div class="media-overlay">
            <span>${leftMeta}</span>
            <span>${rightMeta}</span>
          </div>
        </article>
      `;
    })
    .join("");

  els.paginationBar.classList.remove("hidden");
  els.pageInfo.textContent = `Page ${pageMeta.totalPages ? state.currentPage : 1} of ${pageMeta.totalPages} • ${pageMeta.totalItems} items`;
  els.prevPage.disabled = state.currentPage <= 1;
  els.nextPage.disabled = state.currentPage >= pageMeta.totalPages;

  const canLoadMoreRemote = (state.activeTab === "posts" || state.activeTab === "videos")
    && state.hasMoreRemote
    && !state.loadingMore;
  els.loadMoreRemote.disabled = !canLoadMoreRemote;
  els.loadMoreRemote.textContent = state.loadingMore ? "Loading..." : "Load more posts";
}

function activateTab(tab) {
  state.activeTab = tab;
  state.currentPage = 1;
  els.tabButtons.forEach((btn) => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  renderGrid();
}

function closeModal() {
  els.modal.classList.add("hidden");
  els.modalMediaArea.innerHTML = "";
  els.modalMeta.innerHTML = "";
}

function renderModal() {
  const item = state.modalList[state.modalIndex];
  if (!item) return;

  let childList;
  if (item.type === "highlight") {
    childList = (item.items || []).map((story) => ({
      type: story.type,
      mediaUrl: story.mediaUrl,
      videoUrl: story.videoUrl,
      thumbnailUrl: story.thumbnailUrl
    }));
  } else if (item.type === "carousel" && item.children?.length) {
    childList = item.children;
  } else {
    childList = [{
      type: item.type,
      mediaUrl: item.mediaUrl,
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl
    }];
  }

  if (!childList.length) {
    childList = [{ type: "image", mediaUrl: item.coverUrl || item.thumbnailUrl || "", videoUrl: null, thumbnailUrl: item.coverUrl || item.thumbnailUrl || "" }];
  }

  const child = childList[state.modalChildIndex] || childList[0];
  const mediaUrl = child.videoUrl || child.mediaUrl || child.thumbnailUrl;

  if (child.type === "video" && mediaUrl) {
    els.modalMediaArea.innerHTML = `<video src="${mediaUrl}" controls autoplay playsinline></video>`;
  } else {
    els.modalMediaArea.innerHTML = `<img src="${mediaUrl || ""}" alt="Selected media" />`;
  }

  const downloadUrl = encodeURIComponent(mediaUrl || "");
  const ext = child.type === "video" ? "mp4" : "jpg";
  const downloadName = `${item.id || "media"}-${state.modalChildIndex + 1}.${ext}`;

  els.modalMeta.innerHTML = `
    <div>${item.caption || item.title || "No caption."}</div>
    <div class="meta-line">${formatDate(item.takenAt)}</div>
    <div class="meta-line">Likes: ${numberFormatter.format(item.likeCount || 0)} | Comments: ${numberFormatter.format(item.commentCount || 0)}</div>
    <a class="primary-btn" href="/api/download?url=${downloadUrl}&filename=${encodeURIComponent(downloadName)}">Download this media</a>
  `;

  if (childList.length > 1) {
    els.childNav.classList.remove("hidden");
    els.childIndexText.textContent = `${state.modalChildIndex + 1} / ${childList.length}`;
  } else {
    els.childNav.classList.add("hidden");
  }

  els.modal.classList.remove("hidden");
}

function openModal(index) {
  state.modalList = getDisplayList();
  state.modalIndex = index;
  state.modalChildIndex = 0;
  renderModal();
}

async function searchProfile(username) {
  const clean = username.trim().replace(/^@/, "");
  if (!clean) return;

  setStatus("Searching profile...", "loading");
  els.profileSection.classList.add("hidden");
  els.contentSection.classList.add("hidden");

  try {
    const response = await fetch(`/api/profile/${encodeURIComponent(clean)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch profile.");
    }

    state.profile = data.profile;
    state.posts = data.media || [];
    state.videos = data.videos || [];
    state.highlights = data.highlights || [];
    state.stories = data.stories || [];
    state.activeUsername = clean;
    state.currentPage = 1;
    state.nextMaxId = data.pagination?.nextMaxId || "";
    state.hasMoreRemote = Boolean(data.pagination?.hasMore);
    state.loadingMore = false;
    state.selected.clear();

    renderProfile();
    activateTab("posts");
    updateSelectionUi();

    els.contentSection.classList.remove("hidden");

    let statusText = `Found @${clean}.`;
    if (Array.isArray(data.warnings) && data.warnings.length) {
      statusText += ` Partial data: ${data.warnings.join(" ")}`;
    }
    setStatus(statusText, "success");
  } catch (error) {
    setStatus(error.message || "Search failed.", "error");
  }
}

els.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchProfile(els.usernameInput.value);
});

els.tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

els.gridArea.addEventListener("click", (event) => {
  const checkbox = event.target.closest(".select-checkbox");
  if (checkbox) {
    const id = checkbox.dataset.selectId;
    if (checkbox.checked) state.selected.add(id);
    else state.selected.delete(id);
    updateSelectionUi();
    return;
  }

  const card = event.target.closest(".media-card");
  if (!card) return;
  const index = Number(card.dataset.index || 0);
  openModal(index);
});

els.downloadSelected.addEventListener("click", async () => {
  const currentItems = getDisplayList().filter((item) => state.selected.has(item.id));
  const payloadItems = currentItems.flatMap(itemToDownloadEntries).filter((entry) => entry.url);

  if (!payloadItems.length) {
    setStatus("No downloadable items in current selection.", "error");
    return;
  }

  setStatus("Building ZIP download...", "loading");

  const response = await fetch("/api/download/zip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: payloadItems })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    setStatus(data.error || "Failed to generate ZIP.", "error");
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "instagrab-media.zip";
  anchor.click();
  URL.revokeObjectURL(url);

  setStatus("ZIP download started.", "success");
});

els.prevPage.addEventListener("click", () => {
  state.currentPage = Math.max(1, state.currentPage - 1);
  renderGrid();
});

els.nextPage.addEventListener("click", () => {
  state.currentPage += 1;
  renderGrid();
});

els.loadMoreRemote.addEventListener("click", async () => {
  if (!state.activeUsername || !state.hasMoreRemote || !state.nextMaxId || state.loadingMore) return;

  state.loadingMore = true;
  renderGrid();
  setStatus("Loading more posts...", "loading");

  try {
    const response = await fetch(`/api/profile/${encodeURIComponent(state.activeUsername)}?maxId=${encodeURIComponent(state.nextMaxId)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to load more posts.");
    }

    const existingIds = new Set(state.posts.map((item) => item.id));
    const incoming = (data.media || []).filter((item) => !existingIds.has(item.id));
    state.posts = [...state.posts, ...incoming];
    state.videos = state.posts.filter((item) => item.type === "video" || item.children.some((child) => child.type === "video"));

    state.nextMaxId = data.pagination?.nextMaxId || "";
    state.hasMoreRemote = Boolean(data.pagination?.hasMore);
    setStatus(`Loaded ${incoming.length} more posts.`, "success");
  } catch (error) {
    setStatus(error.message || "Unable to load more posts.", "error");
  } finally {
    state.loadingMore = false;
    renderGrid();
  }
});

els.closeModal.addEventListener("click", closeModal);
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

function shiftItem(step) {
  if (!state.modalList.length) return;
  const total = state.modalList.length;
  state.modalIndex = (state.modalIndex + step + total) % total;
  state.modalChildIndex = 0;
  renderModal();
}

function shiftChild(step) {
  const item = state.modalList[state.modalIndex];
  if (!item) return;
  const total = item.type === "highlight"
    ? (item.items || []).length
    : (item.type === "carousel" ? (item.children || []).length : 0);
  if (!total) return;
  state.modalChildIndex = (state.modalChildIndex + step + total) % total;
  renderModal();
}

els.prevItem.addEventListener("click", () => shiftItem(-1));
els.nextItem.addEventListener("click", () => shiftItem(1));
els.prevChild.addEventListener("click", () => shiftChild(-1));
els.nextChild.addEventListener("click", () => shiftChild(1));

els.themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("theme-light");
  els.themeToggle.textContent = light ? "Dark mode" : "Light mode";
});

localStorage.removeItem("instagrab-history");
