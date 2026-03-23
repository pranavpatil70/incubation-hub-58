# Instagrab

Single-page app for anonymously viewing and downloading public Instagram profile media through a backend proxy.

## Features
- Public profile lookup by username
- Profile card with avatar, bio, counts, verification, and website
- Tabs for Posts, Videos, and Stories/Highlights
- Modal lightbox for live image/video preview with next/previous navigation
- Individual media download and bulk ZIP download
- Dark mode by default with light mode toggle
- Search history persisted in local storage
- Error handling for invalid/private/rate-limited/API failure states

## Setup
1. Install dependencies:
   - npm install
2. Copy `.env.example` values into `.env` and set your RapidAPI key/host/endpoints.
3. Start server:
   - npm run start
4. Open:
   - http://localhost:3000

## RapidAPI Notes
This project is preconfigured for the provided RapidAPI snippet:
- Host: `instagram120.p.rapidapi.com`
- Endpoint: `POST /api/instagram/posts`
- Body: `{ "username": "...", "maxId": "" }`

If your provider differs, adjust:
- `RAPIDAPI_HOST`
- `RAPIDAPI_BASE_URL`
- `POSTS_ENDPOINT`
- `POSTS_METHOD`
- `PROFILE_ENDPOINT` (optional)
- `HIGHLIGHTS_ENDPOINT`

## Disclaimer
This tool is for viewing public content only. Respect copyright and Instagram's Terms of Service.
No user credentials are required. Users are responsible for how downloaded content is used.
