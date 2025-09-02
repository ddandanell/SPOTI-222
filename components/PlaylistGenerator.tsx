
import React, { useState, useEffect, useCallback } from 'react';
import { getUserProfile, searchTrack, createPlaylist, addTracksToPlaylist } from '../services/spotifyApi';
import { SpotifyUser } from '../types';

interface PlaylistGeneratorProps {
    token: string;
    onLogout: () => void;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
);

const PlaylistGenerator: React.FC<PlaylistGeneratorProps> = ({ token, onLogout }) => {
    const [user, setUser] = useState<SpotifyUser | null>(null);
    const [songList, setSongList] = useState('');
    const [playlistName, setPlaylistName] = useState("My Awesome Playlist");
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [playlistUrl, setPlaylistUrl] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserProfile(token);
                setUser(userData);
            } catch (err) {
                setError('Failed to fetch user profile. Your session might have expired.');
                setTimeout(onLogout, 3000);
            }
        };
        fetchUser();
    }, [token, onLogout]);

    const handleCreatePlaylist = useCallback(async () => {
        if (!songList.trim() || !user) return;

        setIsLoading(true);
        setError('');
        setPlaylistUrl('');
        setStatusMessage('Starting process...');

        const songTitles = songList.split('\n').filter(title => title.trim() !== '');
        if (songTitles.length === 0) {
            setError('Please enter at least one song title.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Search for track URIs
            const trackUris: string[] = [];
            for (let i = 0; i < songTitles.length; i++) {
                const title = songTitles[i];
                setStatusMessage(`Searching for song ${i + 1}/${songTitles.length}: "${title}"`);
                const searchResult = await searchTrack(token, title);
                if (searchResult.tracks.items.length > 0) {
                    trackUris.push(searchResult.tracks.items[0].uri);
                }
            }
            
            if (trackUris.length === 0) {
                throw new Error("Couldn't find any of the songs on Spotify.");
            }

            // 2. Create a new playlist
            setStatusMessage('Creating new playlist...');
            const playlist = await createPlaylist(token, user.id, playlistName);

            // 3. Add tracks to the playlist
            setStatusMessage(`Adding ${trackUris.length} songs to "${playlist.name}"...`);
            await addTracksToPlaylist(token, playlist.id, trackUris);

            setStatusMessage('Playlist created successfully!');
            setPlaylistUrl(playlist.external_urls.spotify);

        } catch (err) {
            if (err instanceof Error) {
                setError(`An error occurred: ${err.message}`);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [songList, user, token, playlistName]);

    return (
        <div className="w-full max-w-2xl bg-zinc-800 rounded-lg shadow-2xl p-8 relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                     <h1 className="text-3xl font-bold text-green-400">Create a Playlist</h1>
                     <p className="text-zinc-400">Welcome, {user?.display_name || 'User'}!</p>
                </div>
                <button onClick={onLogout} className="bg-zinc-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors duration-300">
                    Logout
                </button>
            </div>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4">{error}</div>}

            {playlistUrl ? (
                <div className="text-center bg-zinc-700 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-green-400">Success!</h2>
                    <p className="text-zinc-300 mb-6">Your playlist has been created.</p>
                    <a 
                        href={playlistUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full inline-block transition duration-300 transform hover:scale-105"
                    >
                        Open Playlist in Spotify
                    </a>
                    <button onClick={() => setPlaylistUrl('')} className="block mx-auto mt-6 text-zinc-400 hover:text-white transition-colors">
                        Create Another
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="playlistName" className="block text-sm font-medium text-zinc-300 mb-2">
                            Playlist Name
                        </label>
                        <input
                            type="text"
                            id="playlistName"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            className="w-full bg-zinc-700 border-zinc-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            placeholder="e.g., Chill Vibes"
                        />
                    </div>
                    <div>
                        <label htmlFor="songList" className="block text-sm font-medium text-zinc-300 mb-2">
                            Paste Song Titles (one per line)
                        </label>
                        <textarea
                            id="songList"
                            rows={10}
                            value={songList}
                            onChange={(e) => setSongList(e.target.value)}
                            className="w-full bg-zinc-700 border-zinc-600 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            placeholder="Enter song titles here...&#10;Bohemian Rhapsody - Queen&#10;Stairway to Heaven - Led Zeppelin&#10;Hotel California - Eagles"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-zinc-400 flex items-center gap-3">
                           {isLoading && <Spinner/>} {statusMessage}
                        </p>
                        <button
                            onClick={handleCreatePlaylist}
                            disabled={isLoading || !songList.trim()}
                            className="bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 disabled:bg-zinc-600 disabled:cursor-not-allowed hover:bg-green-600"
                        >
                            {isLoading ? 'Creating...' : 'Create Playlist'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistGenerator;
