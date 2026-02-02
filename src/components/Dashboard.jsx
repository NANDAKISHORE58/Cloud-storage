import React, { useState, useEffect } from 'react';
import { Download, Trash2, Upload, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { fileService } from '../services/fileService';
import { authService } from '../services/authService';
import FileUpload from './FileUpload';
import FileList from './FileList';

export default function Dashboard({ user }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalSize: 0,
        lastUpdated: new Date()
    });

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setLoading(true);
        const token = authService.getToken();
        const result = await fileService.listFiles(token);

        if (result.success) {
            setFiles(result.files || []);
            calculateStats(result.files || []);
            setMessage('');
        } else {
            setMessage({ type: 'error', text: result.error });
        }

        setLoading(false);
    };

    const calculateStats = (fileList) => {
        const totalFiles = fileList.length;
        const totalSize = fileList.reduce((sum, file) => sum + (file.size || 0), 0);
        setStats({
            totalFiles,
            totalSize: formatBytes(totalSize),
            lastUpdated: new Date()
        });
    };

    const handleUploadSuccess = () => {
        setMessage({ type: 'success', text: '✅ File uploaded successfully!' });
        setTimeout(() => loadFiles(), 1000);
    };

    const handleDeleteFile = async (fileKey) => {
        if (!window.confirm(`Are you sure you want to delete "${fileKey}"?`)) {
            return;
        }

        const token = authService.getToken();
        const result = await fileService.deleteFile(fileKey, token);

        if (result.success) {
            setMessage({ type: 'success', text: '✅ File deleted successfully!' });
            loadFiles();
        } else {
            setMessage({ type: 'error', text: `❌ ${result.error}` });
        }
    };

    const handleDownloadFile = async (fileKey) => {
        const token = authService.getToken();
        const result = await fileService.downloadFile(fileKey, token);

        if (result.success) {
            setMessage({ type: 'success', text: '✅ File downloaded!' });
        } else {
            setMessage({ type: 'error', text: `❌ ${result.error}` });
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div style={styles.dashboard}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.mainTitle}>📁 Your Files</h1>
                    <p style={styles.subtitle}>Manage your secure cloud storage</p>
                </div>
                <button 
                    style={styles.refreshBtn}
                    onClick={loadFiles}
                    disabled={loading}
                >
                    <RefreshCw size={20} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                    Refresh
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div style={{
                    ...styles.message,
                    background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24'
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Main Content Grid */}
            <div style={styles.mainGrid}>
                {/* Left Column - Original Upload Component */}
                <div style={styles.leftColumn}>
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>

                {/* Right Column - Stats & Info */}
                <div style={styles.rightColumn}>
                    {/* Stats Cards */}
                    <div style={styles.statsContainer}>
                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>📊</div>
                            <div>
                                <div style={styles.statLabel}>Total Files</div>
                                <div style={styles.statValue}>{stats.totalFiles}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>💾</div>
                            <div>
                                <div style={styles.statLabel}>Total Size</div>
                                <div style={styles.statValue}>{stats.totalSize}</div>
                            </div>
                        </div>

                        <div style={styles.statCard}>
                            <div style={styles.statIcon}>⏱️</div>
                            <div>
                                <div style={styles.statLabel}>Last Updated</div>
                                <div style={styles.statValue}>
                                    {stats.lastUpdated.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>ℹ️ Quick Info</h3>
                        <ul style={styles.infoList}>
                            <li>✅ All files are encrypted</li>
                            <li>📝 Version history enabled</li>
                            <li>🔒 OAuth 2.0 secured</li>
                            <li>⚡ High-speed access</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Files List Section */}
            <div style={styles.filesSection}>
                <h2 style={styles.sectionTitle}>
                    📂 Files ({files.length})
                </h2>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p>Loading your files...</p>
                    </div>
                ) : files.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📭</div>
                        <p>No files yet</p>
                        <p style={styles.emptySubtext}>Upload your first file to get started</p>
                    </div>
                ) : (
                    <FileList 
                        files={files}
                        onDelete={handleDeleteFile}
                        onDownload={handleDownloadFile}
                    />
                )}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p>🔐 Your files are encrypted and securely stored in AWS S3</p>
                <p>Last synced: {new Date().toLocaleString()}</p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// ============================================
// STYLES
// ============================================

const styles = {
    dashboard: {
        flex: 1,
        background: '#f8f9fa',
        padding: '20px',
        overflow: 'auto'
    },

    // Header
    header: {
        maxWidth: '1200px',
        margin: '0 auto 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    mainTitle: {
        fontSize: '32px',
        color: '#333',
        margin: 0,
        marginBottom: '5px'
    },

    subtitle: {
        color: '#999',
        margin: 0,
        fontSize: '14px'
    },

    refreshBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'transform 0.2s'
    },

    // Messages
    message: {
        maxWidth: '1200px',
        margin: '0 auto 30px',
        padding: '15px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '500'
    },

    // Main Grid
    mainGrid: {
        maxWidth: '1200px',
        margin: '0 auto 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },

    // Upload Section
    uploadSection: {
        background: 'white',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginTop: '20px',
        position: 'relative',
        zIndex: 1
    },

    uploadCard: {
        border: '2px dashed #667eea',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center',
        background: '#f8f9ff'
    },

    fileInput: {
        display: 'none'
    },

    uploadBtn: {
        padding: '15px 30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s'
    },

    leftColumn: {
        width: '100%'
    },

    rightColumn: {
        width: '100%'
    },

    // Stats
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px'
    },

    statCard: {
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },

    statIcon: {
        fontSize: '32px'
    },

    statLabel: {
        color: '#999',
        fontSize: '12px',
        textTransform: 'uppercase'
    },

    statValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#333',
        marginTop: '5px'
    },

    // Info Card
    infoCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
    },

    infoTitle: {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '15px',
        margin: 0
    },

    infoList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },

    // Files Section
    filesSection: {
        maxWidth: '1200px',
        margin: '0 auto 40px',
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },

    sectionTitle: {
        fontSize: '20px',
        color: '#333',
        marginBottom: '20px',
        margin: '0 0 20px 0'
    },

    loadingContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999'
    },

    spinner: {
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },

    emptyState: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#999'
    },

    emptyIcon: {
        fontSize: '60px',
        marginBottom: '20px'
    },

    emptySubtext: {
        fontSize: '14px',
        marginTop: '10px'
    },

    // Footer
    footer: {
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid #e0e0e0',
        color: '#999',
        fontSize: '14px'
    },

    // Responsive
    '@media (max-width: 768px)': {
        mainGrid: {
            gridTemplateColumns: '1fr'
        },
        header: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px'
        }
    }
};
