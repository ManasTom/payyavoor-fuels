import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, LogIn } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!mobile || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await api.login(mobile, password);
    setLoading(false);

    if (result.success) {
      login(result.user);
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in">
        <div className="text-center mb-6">
          <div style={{ display: 'inline-flex', backgroundColor: 'var(--accent-primary)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Fuel size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            PAYYAVOOR FUELS
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Employee Portal Login</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input 
            label="Mobile Number" 
            id="mobile" 
            type="tel" 
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <Input 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="mt-4">
            <Button type="submit" isLoading={loading}>
              <LogIn size={20} />
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
