// WARNING: This Client ID is provided for demonstration purposes based on the user's request.
// In a real-world application, this should be managed via environment variables.
// The Client Secret is NOT included here as it is not used in the secure PKCE flow for frontend applications.
export const CLIENT_ID = "90e095ee1b85480ab87a6a560005b0be";

// This must match the Redirect URI set in your Spotify Developer Dashboard for the production app.
// It now points to a dedicated callback handler to ensure robust authentication.
export const REDIRECT_URI = "https://spotify-playliste.vercel.app/callback.html";

export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const API_BASE_URL = "https://api.spotify.com/v1";

export const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");