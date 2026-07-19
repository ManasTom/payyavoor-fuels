import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Scanner from '../components/Scanner';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// The expected QR code text as defined in the requirements
const EXPECTED_QR_TEXT = 'payyavoor_fuels_office_loc_clock';

export default function Scan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScanSuccess = async (decodedText) => {
    if (!scanning) return;
    
    setScanning(false);
    
    if (decodedText !== EXPECTED_QR_TEXT) {
      setResult({ success: false, message: 'Invalid QR Code scanned.' });
      return;
    }

    setLoading(true);
    const res = await api.logAttendance(user.mobile, 'Auto');
    setLoading(false);

    if (res.success) {
      setResult({ success: true, message: `Successfully clocked ${res.action} at ${new Date(res.timestamp).toLocaleTimeString()}` });
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      setResult({ success: false, message: res.message || 'Failed to log attendance.' });
    }
  };

  const resetScan = () => {
    setResult(null);
    setScanning(true);
  };

  return (
    <div className="container" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginLeft: '1rem' }}>Scan QR Code</h2>
      </div>

      <div className="glass-card animate-fade-in" style={{ padding: '1rem' }}>
        
        {scanning && !loading && !result && (
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <Scanner onScanSuccess={handleScanSuccess} />
          </div>
        )}

        {loading && (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
             <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Logging attendance...</p>
          </div>
        )}

        {result && (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {result.success ? (
              <>
                <CheckCircle size={64} color="var(--success)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>Success!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Redirecting to dashboard...</p>
              </>
            ) : (
              <>
                <XCircle size={64} color="var(--error)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>Error</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
                <button 
                  onClick={resetScan}
                  className="btn btn-secondary mt-4"
                  style={{ width: 'auto' }}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
