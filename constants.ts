// WARNING: This Client ID is provided for demonstration purposes based on the user's request.
// In a real-world application, this should be managed via environment variables.
// The Client Secret is NOT included here as it is not used in the secure PKCE flow for frontend applications.
export const CLIENT_ID = "90e095ee1b85480ab87a6a560005b0be";

// This must exactly match the Redirect URI set in your Spotify Developer Dashboard.
// Based on your settings, we are setting it to '.../Callback' without the .html extension.
// Vercel typically serves 'Callback.html' from this URL automatically.
export const REDIRECT_URI = new URL('Callback', window.location.origin).href;

export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const API_BASE_URL = "https://api.spotify.com/v1";

export const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");