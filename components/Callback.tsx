import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CLIENT_ID, REDIRECT_URI, TOKEN_ENDPOINT } from '../constants';

const Spinner: React.FC = () => (
    <div style={{
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTop: '4px solid #1DB954',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    }}>
        <style>{`
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }
        `}</style>
    </div>
);


const Callback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Finalizing connection with Spotify...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
                setMessage(`Login failed: ${error}. You may close this window.`);
                setIsError(true);
                return;
            }
            
            const storedVerifier = localStorage.getItem('spotify_pkce_verifier');
            if (!code || !storedVerifier) {
                setMessage('Authentication failed. Missing required data. Please try logging in again.');
                setIsError(true);
                return;
            }

            try {
                const response = await fetch(TOKEN_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: CLIENT_ID,
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: REDIRECT_URI,
                        code_verifier: storedVerifier,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error_description || 'Failed to exchange code for token.');
                }

                const data = await response.json();
                
                const expiryTime = new Date().getTime() + data.expires_in * 1000;
                localStorage.setItem('spotify_access_token', data.access_token);
                localStorage.setItem('spotify_token_expiry', expiryTime.toString());
                localStorage.setItem('spotify_refresh_token', data.refresh_token);
                
                localStorage.removeItem('spotify_pkce_verifier');

                setMessage('Success! This window will now close.');
                setTimeout(() => window.close(), 1000); // Close after a short delay

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setMessage(`An error occurred: ${errorMessage}. Please try again.`);
                setIsError(true);
            }
        };

        handleCallback();
    }, [searchParams]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {!isError && <Spinner />}
            <p style={{ fontSize: '1.1em', color: isError ? '#f44336' : '#fff' }}>
                {message}
            </p>
        </div>
    );
};

export default Callback;
