import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await client.post('/auth/login', { username, password });
            // Backend returns: { id, username, role, token }
            login(res.data.token, {
                id: res.data.id,
                username: res.data.username,
                role: res.data.role
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem'
        }}>
            <div className="card animate-fade-in" style={{
                maxWidth: '380px',
                width: '100%',
                padding: '2rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        marginBottom: '0.3rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🍬 Sweet Shop
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Login to continue</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        color: 'var(--error)',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter username"
                            autoFocus
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>No account? </span>
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
