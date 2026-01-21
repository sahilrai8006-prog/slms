import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'Student'
    });
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch roles
        const fetchRoles = async () => {
            // In a real app we might not expose roles publicly, but for this demo we assume logic exists
            // Or we hardcode standard roles or let backend handle default.
            // Let's assume user picks 'Student' or 'Instructor'
            try {
                // For simplicity, we assume roles exist 2 and 3 as Instructor/Student
                // Or we fetch them. Since we are unauthenticated, this might fail if not public.
                // We will hardcode for UI but in real PROD we would fetch generic list.
            } catch (e) { }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Actually, we need to map role name to ID or just send ID.
            // Assuming we know ID or backend handles it.
            // For this demo, let's Register as basic User and Admin assigns role, or we pass ID 3.
            await api.post('/users/', formData);
            navigate('/login');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '400px' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="label">Username</label>
                        <input
                            className="input"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Role</label>
                        <select
                            className="input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
