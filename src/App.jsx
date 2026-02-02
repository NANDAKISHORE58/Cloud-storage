import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { authService } from './services/authService';
import './styles/App.css';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on app load
    useEffect(() => {
        const token = authService.getToken();
        const username = authService.getUser();

        if (token && username) {
            setIsAuthenticated(true);
            setUser(username);
        }

        setLoading(false);
    }, []);

    // Handle successful login
    const handleLoginSuccess = (username) => {
        setUser(username);
        setIsAuthenticated(true);
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading Cloud Storage...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                {/* Show navbar only if user is authenticated */}
                {isAuthenticated && (
                    <Navbar user={user} onLogout={handleLogout} />
                )}

                {/* Route between Login and Dashboard based on authentication */}
                <Routes>
                    {!isAuthenticated ? (
                        // Show login page if not authenticated
                        <>
                            <Route 
                                path="/" 
                                element={<Login onLoginSuccess={handleLoginSuccess} />} 
                            />
                            <Route 
                                path="*" 
                                element={<Navigate to="/" replace />} 
                            />
                        </>
                    ) : (
                        // Show dashboard if authenticated
                        <>
                            <Route 
                                path="/" 
                                element={<Dashboard user={user} />} 
                            />
                            <Route 
                                path="/dashboard" 
                                element={<Dashboard user={user} />} 
                            />
                            <Route 
                                path="*" 
                                element={<Navigate to="/" replace />} 
                            />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
}

// ============================================
// LOADING SCREEN STYLES
// ============================================

const styles = {
    loadingContainer: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },

    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255, 255, 255, 0.3)',
        borderTop: '5px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },

    loadingText: {
        fontSize: '18px',
        fontWeight: '600',
        margin: 0
    }
};


