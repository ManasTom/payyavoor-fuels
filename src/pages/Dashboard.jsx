import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, LogOut, Clock, User } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchStatus = async () => {
      const res = await api.getStatus(user.mobile);
      if (res.success) {
        setStatus(res.lastAction);
      } else {
        setStatus('Unknown');
      }
      setLoading(false);
    };

    fetchStatus();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>PAYYAVOOR FUELS</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/profile')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <User size={20} />
            <span style={{ fontSize: '0.9rem' }}>Profile</span>
          </button>
          <button 
            onClick={handleLogout}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={20} />
            <span style={{ fontSize: '0.9rem' }}>Logout</span>
          </button>
        </div>
      </div>

      <div className="glass-card animate-fade-in mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <User size={24} color="var(--accent-primary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome back,</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{user.name}</h3>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--text-secondary)" />
              <span style={{ color: 'var(--text-secondary)' }}>Current Status</span>
            </div>
            {loading ? (
              <span style={{ color: 'var(--text-secondary)' }}>Checking...</span>
            ) : (
              <span className={`status-badge ${status === 'In' ? 'status-in' : 'status-out'}`}>
                Clocked {status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Scan the QR code at the office to automatically {status === 'In' ? 'clock out' : 'clock in'}.
        </p>
        
        <Button onClick={() => navigate('/scan')} style={{ padding: '1.25rem' }}>
          <QrCode size={24} />
          Scan QR Code
        </Button>
      </div>

    </div>
  );
}
