import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/token/', { username, password });
            localStorage.setItem('token', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);

            // Get user role and name
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

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="label">Username</label>
                        <input
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
