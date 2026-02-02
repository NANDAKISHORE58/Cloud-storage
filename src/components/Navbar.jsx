import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Cloud } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        onLogout();
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <div style={styles.brand}>
                    <Cloud size={28} color="white" />
                    <h1 style={styles.title}>Cloud Storage</h1>
                </div>
                {user && (
                    <div style={styles.userSection}>
                        <span style={styles.userName}>👤 {user}</span>
                        <button style={styles.logoutBtn} onClick={handleLogout}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '15px 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: 'white',
        flexShrink: 0
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    title: {
        fontSize: '24px',
        margin: 0
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userName: {
        fontSize: '14px'
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        transition: 'background 0.3s'
    }
};
