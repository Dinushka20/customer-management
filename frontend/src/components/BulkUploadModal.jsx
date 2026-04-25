import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function BulkUploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/customers/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      toast.success(`Processed: ${res.data.totalProcessed}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload Excel file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '20px' }}>Bulk Upload Customers</h2>
        
        {!result ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Upload an Excel (.xlsx) file. Column A: Name, Column B: DOB (YYYY-MM-DD), Column C: NIC. Row 1 is skipped.
            </p>

            <div 
              style={{
                border: '2px dashed var(--primary-color)', borderRadius: '12px', padding: '40px 20px',
                textAlign: 'center', cursor: 'pointer', background: 'rgba(99,102,241,0.05)', marginBottom: '20px'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: '500' }}>{file ? file.name : 'Click to Browse .xlsx File'}</p>
              <input 
                type="file" 
                accept=".xlsx" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? 'Processing...' : 'Upload Data'}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success-color)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--success-color)', marginBottom: '10px' }}>Upload Complete!</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>Total Processed: <strong>{result.totalProcessed}</strong></li>
                <li>Created: <strong>{result.created}</strong></li>
                <li>Updated: <strong>{result.updated}</strong></li>
              </ul>
            </div>
            
            {result.errors?.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '15px', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                <p style={{ color: '#fca5a5', fontWeight: '500', marginBottom: '5px' }}>Errors Encountered ({result.errors.length}):</p>
                <ul style={{ color: '#fca5a5', fontSize: '0.85rem', paddingLeft: '20px' }}>
                  {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={onSuccess}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
