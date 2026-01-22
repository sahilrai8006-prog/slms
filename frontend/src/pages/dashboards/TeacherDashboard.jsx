import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        avgRating: 4.8
    });

    const deleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to delete this course? All modules and lessons will be lost.")) {
            try {
                await api.delete(`/courses/${id}/`);
                setCourses(courses.filter(c => c.id !== id));
                setStats(prev => ({ ...prev, activeCourses: prev.activeCourses - 1 }));
            } catch (err) {
                alert("Failed to delete course. You may not have permission.");
            }
        }
    };

    const addAnnouncement = async (courseId) => {
        const title = prompt("Enter Announcement Title:");
        if (!title) return;
        const content = prompt("Enter Announcement Content:");
        if (!content) return;

        try {
            await api.post('/announcements/', { title, content, course: courseId });
            alert("Announcement posted successfully!");
        } catch (err) {
            alert("Failed to post announcement.");
        }
    };

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                // In a production app, the backend should return only courses taught by the user
                const res = await api.get('/courses/');
                // For this demo, we'll show the courses if we are an instructor.
                // Ideally backend handles filtering.
                setCourses(res.data);
                setStats(prev => ({ ...prev, activeCourses: res.data.length, totalStudents: res.data.length * 12 })); // Mock stats
            } catch (err) {
                console.error("Error fetching teacher data", err);
            }
        };
        fetchTeacherData();
    }, []);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Instructor Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your courses and interact with your students.</p>
                </div>
                <button onClick={() => navigate('/create-course')} className="btn btn-primary">
                    <span>+</span> Create New Course
                </button>
            </div>


            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.activeCourses}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published Courses</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>{stats.totalStudents}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b' }}>{stats.avgRating}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Rating</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>My Published Courses</h2>
                <Link to="/courses" style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>View all</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem', color: '#8b5cf6', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.1em' }}>ACTIVE</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{course.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flexGrow: 1 }}>
                                {course.description.length > 100 ? course.description.substring(0, 100) + '...' : course.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                    <strong>12</strong> Students
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => addAnnouncement(course.id)} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                                        Post Update
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                                        Analytics
                                    </button>
                                    <button
                                        onClick={() => navigate(`/manage-course/${course.id}`)}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="btn"
                                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                        <h3>No Courses Created</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Ready to share your knowledge? Create your first course and reach thousands of students.
                        </p>
                        <button className="btn btn-primary">
                            Launch Your First Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
