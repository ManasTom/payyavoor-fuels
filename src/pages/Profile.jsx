import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, Lock, Phone } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newMobile, setNewMobile] = useState(user?.mobile || '');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!currentPassword || !newMobile || !newPassword) {
      setError('Please fill in all fields to update your profile.');
      return;
    }

    setLoading(true);
    const result = await api.updateProfile(user.mobile, currentPassword, newMobile, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      login(result.user); // Update auth context with new user details
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setError(result.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', width: '100%', maxWidth: '400px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            marginRight: '1rem'
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>My Profile</h1>
      </div>

      <div className="glass-card animate-fade-in">
        <div className="text-center mb-6">
          <div style={{ display: 'inline-flex', backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <User size={40} color="var(--accent-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {user?.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Employee</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              To update your details, please verify your current password first.
            </p>
            <Input 
              label="Current Password" 
              id="currentPassword" 
              type="password" 
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={<Lock size={18} />}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Input 
              label="New Mobile Number" 
              id="newMobile" 
              type="tel" 
              placeholder="Enter new mobile number"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              icon={<Phone size={18} />}
            />
            <Input 
              label="New Password" 
              id="newPassword" 
              type="password" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<Lock size={18} />}
            />
          </div>
          
          <div className="mt-4">
            <Button type="submit" isLoading={loading}>
              <Save size={20} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
