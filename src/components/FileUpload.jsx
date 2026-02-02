import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { fileService } from '../services/fileService';
import { authService } from '../services/authService';

export default function FileUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current.files[0]) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setLoading(true);
    setMessage('');

    const file = fileInputRef.current.files[0];
    const token = authService.getToken();
    const result = await fileService.uploadFile(file, token);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFileName('');
      fileInputRef.current.value = '';
      onUploadSuccess();
    } else {
      setMessage({ type: 'error', text: result.error });
    }

    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        <Upload size={20} /> Upload File
      </h2>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.type === 'error' ? styles.error : styles.success),
          }}
        >
          {message.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div style={styles.inputGroup}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={styles.fileInput}
        />
        <span style={styles.fileName}>
          {fileName || 'No file selected'}
        </span>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    marginBottom: '16px',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px',
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
  },
  success: {
    background: '#d4edda',
    color: '#155724',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  fileInput: {
    padding: '6px 0',
  },
  fileName: {
    fontSize: '13px',
    color: '#555',
  },
  button: {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
