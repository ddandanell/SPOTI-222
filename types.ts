
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; }[];
  album: { name: string; };
  uri: string;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    external_urls: {
        spotify: string;
    };
}
