import React, { useState } from 'react';
import { Download, Trash2, Copy, FileIcon, Calendar, HardDrive, Share2 } from 'lucide-react';

export default function FileList({ files, onDelete, onDownload }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter files based on search and type
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || getFileType(file.name) === filterType;
        return matchesSearch && matchesType;
    });

    // Sort files
    const sortedFiles = [...filteredFiles].sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'size':
                return (b.size || 0) - (a.size || 0);
            case 'date':
                return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
            default:
                return 0;
        }
    });

    const getFileType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return 'pdf';
        if (['doc', 'docx'].includes(ext)) return 'document';
        if (['xls', 'xlsx'].includes(ext)) return 'spreadsheet';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
        if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
        if (['mp3', 'wav', 'flac'].includes(ext)) return 'audio';
        if (['zip', 'rar', '7z'].includes(ext)) return 'archive';
        return 'other';
    };

    const getFileIcon = (filename) => {
        const type = getFileType(filename);
        const icons = {
            pdf: '📄',
            document: '📝',
            spreadsheet: '📊',
            image: '🖼️',
            video: '🎬',
            audio: '🎵',
            archive: '📦',
            other: '📎'
        };
        return icons[type] || '📎';
    };

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleFileSelection = (fileName) => {
        setSelectedFiles(prev =>
            prev.includes(fileName)
                ? prev.filter(f => f !== fileName)
                : [...prev, fileName]
        );
    };

    const selectAllFiles = () => {
        if (selectedFiles.length === sortedFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(sortedFiles.map(f => f.name));
        }
    };

    const copyFileName = (fileName) => {
        navigator.clipboard.writeText(fileName);
    };

    const deleteSelectedFiles = () => {
        if (selectedFiles.length === 0) return;
        
        if (window.confirm(`Delete ${selectedFiles.length} file(s)?`)) {
            selectedFiles.forEach(fileName => onDelete(fileName));
            setSelectedFiles([]);
        }
    };

    const downloadSelectedFiles = () => {
        if (selectedFiles.length === 0) return;
        
        selectedFiles.forEach(fileName => onDownload(fileName));
    };

    return (
        <div style={styles.container}>
            {/* Search and Filter Bar */}
            <div style={styles.toolbar}>
                <div style={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="🔍 Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.filterSection}>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Files</option>
                        <option value="pdf">📄 PDF</option>
                        <option value="document">📝 Documents</option>
                        <option value="spreadsheet">📊 Spreadsheets</option>
                        <option value="image">🖼️ Images</option>
                        <option value="video">🎬 Videos</option>
                        <option value="audio">🎵 Audio</option>
                        <option value="archive">📦 Archives</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="name">Sort: Name</option>
                        <option value="size">Sort: Size</option>
                        <option value="date">Sort: Date</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedFiles.length > 0 && (
                <div style={styles.bulkActions}>
                    <div style={styles.selectionInfo}>
                        ✅ {selectedFiles.length} file(s) selected
                    </div>
                    <div style={styles.bulkButtons}>
                        <button 
                            style={styles.bulkBtn}
                            onClick={downloadSelectedFiles}
                        >
                            <Download size={16} /> Download
                        </button>
                        <button 
                            style={{...styles.bulkBtn, background: '#ff4757'}}
                            onClick={deleteSelectedFiles}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Files Table */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.checkboxCol}>
                                <input
                                    type="checkbox"
                                    checked={selectedFiles.length === sortedFiles.length && sortedFiles.length > 0}
                                    onChange={selectAllFiles}
                                    style={styles.checkbox}
                                />
                            </th>
                            <th style={{...styles.th, flex: 3}}>📄 File Name</th>
                            <th style={{...styles.th, flex: 1}}>💾 Size</th>
                            <th style={{...styles.th, flex: 1.5}}>📅 Modified</th>
                            <th style={{...styles.th, flex: 1}}>⚙️ Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFiles.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={styles.emptyCell}>
                                    <div style={styles.emptyMessage}>
                                        📭 No files found
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sortedFiles.map((file, index) => (
                                <tr 
                                    key={index}
                                    style={{
                                        ...styles.row,
                                        background: selectedFiles.includes(file.name) ? '#f0f0ff' : (index % 2 === 0 ? '#fff' : '#f9f9f9')
                                    }}
                                >
                                    <td style={styles.checkboxCol}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.includes(file.name)}
                                            onChange={() => toggleFileSelection(file.name)}
                                            style={styles.checkbox}
                                        />
                                    </td>
                                    <td style={{...styles.td, flex: 3}}>
                                        <div style={styles.fileNameCell}>
                                            <span style={styles.fileIcon}>{getFileIcon(file.name)}</span>
                                            <div>
                                                <div style={styles.fileName}>{file.name}</div>
                                                <div style={styles.fileVersion}>
                                                    Version: {file.versionId ? file.versionId.substring(0, 8) : 'Latest'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{...styles.td, flex: 1}}>
                                        <span style={styles.size}>
                                            {formatBytes(file.size)}
                                        </span>
                                    </td>
                                    <td style={{...styles.td, flex: 1.5}}>
                                        <span style={styles.date}>
                                            {formatDate(file.lastModified)}
                                        </span>
                                    </td>
                                    <td style={{...styles.td, flex: 1}}>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.actionBtn}
                                                onClick={() => copyFileName(file.name)}
                                                title="Copy filename"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                style={styles.actionBtn}
                                                onClick={() => onDownload(file.name)}
                                                title="Download file"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                style={{...styles.actionBtn, background: '#ff4757'}}
                                                onClick={() => onDelete(file.name)}
                                                title="Delete file"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            {sortedFiles.length > 0 && (
                <div style={styles.summary}>
                    <div style={styles.summaryItem}>
                        📊 Total Files: <strong>{sortedFiles.length}</strong>
                    </div>
                    <div style={styles.summaryItem}>
                        💾 Total Size: <strong>{formatBytes(sortedFiles.reduce((sum, f) => sum + (f.size || 0), 0))}</strong>
                    </div>
                    <div style={styles.summaryItem}>
                        ✅ Showing {sortedFiles.length} of {files.length} files
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// STYLES
// ============================================

const styles = {
    container: {
        width: '100%'
    },

    // Toolbar
    toolbar: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
    },

    searchSection: {
        flex: 1,
        minWidth: '200px'
    },

    searchInput: {
        width: '100%',
        padding: '10px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box'
    },

    filterSection: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },

    filterSelect: {
        padding: '10px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        background: 'white',
        transition: 'border-color 0.3s'
    },

    // Bulk Actions
    bulkActions: {
        background: '#e8f4f8',
        border: '2px solid #667eea',
        borderRadius: '8px',
        padding: '15px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
    },

    selectionInfo: {
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
    },

    bulkButtons: {
        display: 'flex',
        gap: '10px'
    },

    bulkBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'opacity 0.2s'
    },

    // Table
    tableWrapper: {
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
    },

    headerRow: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: '600',
        textAlign: 'left'
    },

    th: {
        padding: '15px',
        fontWeight: '600',
        borderBottom: 'none'
    },

    checkboxCol: {
        width: '50px',
        padding: '15px',
        textAlign: 'center'
    },

    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },

    row: {
        borderBottom: '1px solid #e0e0e0',
        transition: 'background 0.2s',
        display: 'table-row'
    },

    td: {
        padding: '15px'
    },

    fileNameCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },

    fileIcon: {
        fontSize: '20px'
    },

    fileName: {
        fontWeight: '600',
        color: '#333',
        marginBottom: '2px'
    },

    fileVersion: {
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic'
    },

    size: {
        fontWeight: '500',
        color: '#555'
    },

    date: {
        color: '#666',
        fontSize: '13px'
    },

    actions: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
    },

    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'opacity 0.2s'
    },

    emptyCell: {
        padding: '40px',
        textAlign: 'center'
    },

    emptyMessage: {
        fontSize: '16px',
        color: '#666',
        fontWeight: '500'
    },

    summary: {
        display: 'flex',
        gap: '30px',
        marginTop: '20px',
        padding: '15px 20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        flexWrap: 'wrap'
    },

    summaryItem: {
        fontSize: '14px',
        color: '#555'
    }
};