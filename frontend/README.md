# NutriChat Frontend (Vite + React)

Minimal frontend to interact with the NutriChat backend.

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Run dev server:
   ```
   npm run dev
   ```
3. The app assumes the backend endpoints are:
   - POST /api/documents/upload (multipart form-data with `file`)
   - POST /api/chat (JSON: { documentId, question })

Adjust `BASE_URL` in `src/config.js` if your backend runs on another host/port.
