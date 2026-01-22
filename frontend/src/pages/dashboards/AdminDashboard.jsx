import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrolled: 0,
        pendingApprovals: 3
    });
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [usersRes, coursesRes] = await Promise.all([
                    api.get('/users/'),
                    api.get('/courses/')
                ]);
                setUsers(usersRes.data);
                setCourses(coursesRes.data);
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.data.length,
                    totalCourses: coursesRes.data.length
                }));
            } catch (err) {
                console.error("Error fetching admin data", err);
            }
        };
        fetchAdminData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}/`);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                alert("Failed to delete user");
            }
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}/`);
                setCourses(courses.filter(c => c.id !== id));
            } catch (err) {
                alert("Failed to delete course");
            }
        }
    };

    const downloadReport = () => {
        if (users.length === 0) {
            alert("No data available to download.");
            return;
        }
        const timestamp = new Date().toISOString().split('T')[0];
        let csv = "ID,Username,Email,Role,Joined\n";
        users.forEach(user => {
            csv += `${user.id},${user.username},${user.email},${user.role_name || 'Student'},${formatDate(user.date_joined)}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `SmartLMS_User_Report_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>System Administration</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Full system control and performance monitoring.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={downloadReport}>Download Report</button>
                    <button className="btn btn-primary">System Health</button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{stats.totalUsers}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Total Users</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.totalCourses}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Courses</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.totalUsers * 2}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrollments</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{stats.pendingApprovals}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Alerts</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{ background: 'none', border: 'none', color: activeTab === 'users' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                    Users Management
                </button>
                <button
                    onClick={() => setActiveTab('courses')}
                    style={{ background: 'none', border: 'none', color: activeTab === 'courses' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                    Courses Review
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                    System Settings
                </button>
            </div>

            {/* Content based on tab */}
            <div className="card" style={{ padding: activeTab === 'settings' ? '2rem' : '0' }}>
                {activeTab === 'users' ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'var(--primary-light)' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>User</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Joined</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {user.username[0].toUpperCase()}
                                                </div>
                                                <span>{user.username}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                background: user.role_name === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : (user.role_name === 'Teacher' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(56, 189, 248, 0.1)'),
                                                color: user.role_name === 'Admin' ? '#ef4444' : (user.role_name === 'Teacher' ? '#a78bfa' : '#38bdf8')
                                            }}>
                                                {user.role_name || 'Student'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{formatDate(user.date_joined)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>Edit</button>
                                            <button onClick={() => deleteUser(user.id)} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'courses' ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'var(--primary-light)' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Course Title</th>
                                    <th style={{ padding: '1rem' }}>Instructor</th>
                                    <th style={{ padding: '1rem' }}>Enrollments</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{course.title}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{course.instructor_name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '100px', height: '6px', background: 'var(--primary-light)', borderRadius: '3px' }}>
                                                    <div style={{ width: '70%', height: '100%', background: 'var(--accent)', borderRadius: '3px' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem' }}>12</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => navigate(`/courses/${course.id}`)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>View</button>
                                            <button onClick={() => deleteCourse(course.id)} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="fade-in" style={{ maxWidth: '600px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>General Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label className="label">Site Name</label>
                                <input className="input" defaultValue="SmartLMS Pro" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--primary-light)', borderRadius: '0.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>Maintenance Mode</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Disable all public access.</div>
                                </div>
                                <div style={{ width: '40px', height: '20px', background: 'var(--border)', borderRadius: '10px', position: 'relative' }}>
                                    <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Settings Saved!')}>Save Changes</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
