import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [focusedInput, setFocusedInput] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/token/', { username, password });
            localStorage.setItem('token', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            localStorage.setItem('role', role);

            const userRes = await api.get('/users/me/', {
                headers: { Authorization: `Bearer ${res.data.access}` }
            });
            localStorage.setItem('role', userRes.data.role_name);
            localStorage.setItem('username', userRes.data.username);
            localStorage.setItem('first_name', userRes.data.first_name || '');
            localStorage.setItem('last_name', userRes.data.last_name || '');

            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Login failed';
            alert('Error: ' + errorMsg);
        }
    };

    const handleGoogleLogin = () => {
        // Real Google OAuth Flow
        // Note: You need to replace 'YOUR_GOOGLE_CLIENT_ID' with a real one from Google Cloud Console
        const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
        const REDIRECT_URI = "http://localhost:8090/login";
        const SCOPE = "email profile";
        const RESPONSE_TYPE = "token";

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

        // Redirect to Google
        window.location.href = googleAuthUrl;
    };

    // Helper for Floating Label
    const FloatingInput = ({ label, type, value, onChange, name }) => {
        const isFocused = focusedInput === name || value.length > 0;
        return (
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedInput(name)}
                    onBlur={() => setFocusedInput(null)}
                    required
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 0.6rem',
                        borderRadius: '0.75rem',
                        border: isFocused ? '1px solid #ea580c' : '1px solid #cbd5e1',
                        backgroundColor: '#fff',
                        color: '#1e293b',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        height: '3.5rem'
                    }}
                />
                <label style={{
                    position: 'absolute',
                    left: '1rem',
                    top: isFocused ? '0.4rem' : '1rem',
                    fontSize: isFocused ? '0.75rem' : '1rem',
                    color: isFocused ? '#ea580c' : '#64748b',
                    pointerEvents: 'none',
                    transition: 'all 0.2s',
                    fontWeight: isFocused ? '600' : '400',
                    backgroundColor: 'transparent'
                }}>
                    {label}
                </label>
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e2e8f0',
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(234, 88, 12, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.1) 0px, transparent 50%)',
            padding: '2rem'
        }}>
            <div className="login-container fade-in" style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1100px',
                background: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                minHeight: '650px'
            }}>
                {/* LEFT SIDE - Professional Branding */}
                <div style={{
                    flex: '1.2',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #c2410c 100%)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                    color: 'white',
                    overflow: 'hidden'
                }}>
                    {/* Abstract Shapes */}
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ marginBottom: '2rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
                            ✨ #1 Learning Platform
                        </div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            Unlock Your <br />
                            <span style={{ color: '#fed7aa' }}>Potential Today.</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.7', marginBottom: '3rem', maxWidth: '90%' }}>
                            Join a community of thousands of learners and experts. Master new skills with our top-rated courses and certifications.
                        </p>

                        {/* Trust Stats */}
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>10k+</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Active Students</p>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>500+</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Top Instructors</p>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>4.9</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>User Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Clean Form */}
                <div style={{
                    flex: '1',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: '#ffffff'
                }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ color: '#c2410c', fontWeight: '800', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            🦊 SmartLMS
                        </h2>
                        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '700' }}>Welcome Back!</h1>
                        <p style={{ color: '#64748b' }}>Please login to access your dashboard.</p>
                    </div>

                    {/* Role Toggles */}
                    <div style={{ background: '#f1f5f9', padding: '0.4rem', borderRadius: '0.75rem', display: 'flex', marginBottom: '2rem' }}>
                        {['Student', 'Teacher'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    border: 'none',
                                    background: role === r ? '#fff' : 'transparent',
                                    color: role === r ? '#ea580c' : '#64748b',
                                    boxShadow: role === r ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {r === 'Teacher' ? 'Admin / Teacher' : 'Student'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FloatingInput
                            label="Username or Email"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            name="username"
                        />
                        <FloatingInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
                                <input type="checkbox" style={{ marginRight: '0.5rem', width: '16px', height: '16px', accentColor: '#ea580c' }} />
                                Remember me
                            </label>
                            <a href="#" style={{ color: '#ea580c', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(to right, #ea580c, #c2410c)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '1.05rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.3)',
                                transition: 'transform 0.2s',
                                marginBottom: '1.5rem'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Sign In
                        </button>
                    </form>

                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.75rem',
                            color: '#475569',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
                        onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e2e8f0'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                            Don't have an account? <Link to="/register" style={{ color: '#ea580c', fontWeight: '700', textDecoration: 'none' }}>Create free account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
