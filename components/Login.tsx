import React from 'react';
import { CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, SCOPES } from '../constants';
import { generatePkceCodes } from '../services/pkce';

const SpotifyLogo = () => (
    <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.476a9.524 9.524 0 100 19.048 9.524 9.524 0 000-19.048zM8.038 17.558a.5.5 0 01-.688.18A7.554 7.554 0 014.5 13.354a.5.5 0 01.5-.5c.276 0 .5.224.5.5a6.555 6.555 0 002.85 3.102.5.5 0 01.188.602zM8.68 15.035a.438.438 0 01-.612.158 6.018 6.018 0 01-3.232-2.934.438.438 0 11.76-.432 5.12 5.12 0 002.75 2.5a.438.438 0 01.158.612zm.48-2.52a.375.375 0 01-.525.132 4.542 4.542 0 01-2.738-2.58.375.375 0 11.65-.375 3.792 3.792 0 002.28 2.15.375.375 0 01.132.525zm5.325 3.63a.5.5 0 01-.707 0L8.49 11.41a.5.5 0 010-.707l4.767-4.767a.5.5 0 01.707.707L9.2 11.057l4.296 4.296a.5.5 0 010 .707z"></path>
    </svg>
);

const Login: React.FC = () => {

    const handleLogin = async () => {
        const { verifier, challenge } = await generatePkceCodes();
        localStorage.setItem("spotify_pkce_verifier", verifier);
        
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: REDIRECT_URI,
            scope: SCOPES,
            code_challenge_method: 'S256',
            code_challenge: challenge,
        });

        // Open the authorization URL in a new popup window to avoid iframe restrictions.
        const authUrl = `${AUTH_ENDPOINT}?${params.toString()}`;
        window.open(authUrl, "spotify_login", "width=800,height=600,noopener,noreferrer");
    };

    return (
        <div className="text-center p-8 bg-zinc-800 rounded-lg shadow-2xl max-w-2xl w-full">
            <h1 className="text-4xl font-bold mb-2 text-green-400">GOA Playlist Generator</h1>
            <p className="text-zinc-300 mb-8">Turn any list of songs into a Spotify playlist instantly.</p>
            
            <button
                onClick={handleLogin}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center space-x-3 transition duration-300 transform hover:scale-105"
            >
                <SpotifyLogo />
                <span>Login with Spotify</span>
            </button>
        </div>
    );
};

export default Login;