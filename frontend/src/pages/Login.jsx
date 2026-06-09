import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected due to expired token
  useEffect(() => {
    if (location.search.includes('expired=true')) {
      setSessionExpiredMsg(true);
    }
  }, [location]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('shiro_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSessionExpiredMsg(false);

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // Save credentials
      localStorage.setItem('shiro_token', response.data.token);
      localStorage.setItem('shiro_user', JSON.stringify(response.data.user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Invalid login credentials. Please verify and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ebony min-h-screen flex items-center justify-center px-6">
      
      {/* Background Ambience decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#2A2827_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-jade/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Login Box */}
      <div className="relative w-full max-w-md bg-ebony-card border border-stone-border p-10 shadow-2xl z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-gold">
            SHIRO
          </span>
          <p className="text-[10px] tracking-[0.35em] text-stone uppercase mt-1">
            Staff Portal Administration
          </p>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Notices */}
        {sessionExpiredMsg && (
          <div className="mb-6 p-3 bg-gold/10 border border-gold/30 text-gold text-xs font-light text-center flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Session expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-crimson/10 border border-crimson/30 text-crimson text-xs font-light flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="w-full bg-ebony-light border border-stone-border py-2.5 pl-10 pr-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-ebony-light border border-stone-border py-2.5 pl-10 pr-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 disabled:bg-stone/50 shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-[10px] tracking-widest text-stone hover:text-gold uppercase transition-colors">
            ← Back to Customer Site
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;
