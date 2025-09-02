import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import PlaylistGenerator from './components/PlaylistGenerator';

const AppContent: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // This function syncs the auth state from localStorage to the component's state
    const syncAuthState = () => {
        const tokenInStorage = localStorage.getItem('spotify_access_token');
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        if (tokenInStorage && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
            setToken(tokenInStorage);
            navigate('/'); // Ensure user is on the main page after login
        } else {
            // Token is expired or not present, clear localStorage to ensure a clean state
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_expiry');
            localStorage.removeItem('spotify_refresh_token');
            setToken(null);
        }
    };

    syncAuthState(); // Check on initial load
    
    // Listen for token refresh events from the API service
    const handleTokenRefreshed = (event: CustomEvent) => {
        if (event.detail.accessToken) {
            setToken(event.detail.accessToken);
        }
    };
    window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);

    // Listen for storage changes from other tabs (e.g., login popup)
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'spotify_access_token') {
            syncAuthState();
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
        window.removeEventListener('storage', handleStorageChange);
    };

  }, [navigate]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_refresh_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <Routes>
        <Route path="/" element={
          token ? <PlaylistGenerator token={token} onLogout={handleLogout} /> : <Login />
        } />
      </Routes>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    )
}

export default App;