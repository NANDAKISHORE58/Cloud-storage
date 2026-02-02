import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('Password123!');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await authService.login(username, password);

        if (result.success) {
            onLoginSuccess(result.username);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🔐 Secure Login</h1>
                <p style={styles.subtitle}>Access your cloud storage</p>

                <form onSubmit={handleLogin} style={styles.form}>
                    {error && (
                        <div style={styles.error}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            style={styles.input}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{...styles.button, opacity: loading ? 0.7 : 1}}
                    >
                        <LogIn size={18} />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={styles.info}>
  <h3>Demo Credentials</h3>
  <p>
    <strong>Username:</strong> testuser
  </p>
  <p>
    <strong>Password:</strong> Password123!
  </p>
</div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        fontSize: '28px',
        marginBottom: '10px',
        color: '#333',
        textAlign: 'center'
    },
    subtitle: {
        textAlign: 'center',
        color: '#999',
        marginBottom: '30px'
    },
    form: {
        marginBottom: '30px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontWeight: '600'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.2s'
    },
    error: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    info: {
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px'
    }
};

