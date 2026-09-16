import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!userName.trim() || !email.trim() || !password) {
      setError('Username, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signup({
        name: name.trim() || userName.trim(),
        userName: userName.trim(),
        email: email.trim(),
        password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Username or email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: '28px 24px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            <MessageSquare size={22} />
          </div>
          <h1
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: '4px',
            }}
          >
            Create an account
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
            Join NexChat to start real-time messaging
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">
              Full Name (Optional)
            </label>
            <input
              id="signup-name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-username" className="form-label">
              Username <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="signup-username"
              type="text"
              className="input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. alex_m"
              autoComplete="username"
              required
            />
            <span className="form-hint">Used for direct messaging search</span>
          </div>

          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email Address <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="signup-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              Password <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                style={{ paddingRight: '36px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  color: 'var(--muted-foreground)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '40px', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Creating account...</span>
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 500 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

