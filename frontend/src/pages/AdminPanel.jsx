import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/users/').then(res => setUsers(res.data));
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem' }}>
                <h1>Admin Panel</h1>
                <div className="card">
                    <h2>Users Management</h2>
                    <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td><button className="btn btn-primary" style={{ transform: 'scale(0.8)' }}>Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
