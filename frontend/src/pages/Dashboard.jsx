import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [teaching, setTeaching] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            if (role === 'Student') {
                const res = await api.get('/enrollments/');
                setEnrollments(res.data);
            } else if (role === 'Teacher') {
                // In real app filter by instructor.
                // For now just show all courses or filter in frontend if API returns all.
                // Or specific endpoint.
                const res = await api.get('/courses/');
                // Filter by me
                // Assuming API returns instructor ID or we filter.
                // Let's just list courses for now.
                setTeaching(res.data);
            }
        };
        fetchData();
    }, [role]);

    return (
        <>
            <Navbar />
            <div className="container fade-in" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>{role} Dashboard</h1>
                    <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Active System</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {role === 'Student' && (
                        <>
                            {enrollments.length > 0 ? enrollments.map(enrol => (
                                <div key={enrol.id} className="card fade-in">
                                    <div style={{ marginBottom: '1rem', color: 'var(--accent)', fontWeight: '600' }}>COURSE ENROLLED</div>
                                    <h3>Course ID: {enrol.course}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Enrolled: {new Date(enrol.enrolled_at).toLocaleDateString()}</p>
                                    <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Continue Learning</button>
                                </div>
                            )) : (
                                <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>You haven't enrolled in any courses yet.</p>
                                    <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Courses</Link>
                                </div>
                            )}
                        </>
                    )}

                    {role === 'Teacher' && (
                        <>
                            {teaching.length > 0 ? teaching.map(course => (
                                <div key={course.id} className="card fade-in">
                                    <div style={{ marginBottom: '1rem', color: '#8b5cf6', fontWeight: '600' }}>COURSE PUBLISHED</div>
                                    <h3>{course.title}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>{course.description.substring(0, 80)}...</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button className="btn btn-primary" style={{ flex: 1 }}>Edit</button>
                                        <button className="btn btn-secondary" style={{ flex: 1 }}>Stats</button>
                                    </div>
                                </div>
                            )) : (
                                <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>You haven't created any courses yet.</p>
                                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Create First Course</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
