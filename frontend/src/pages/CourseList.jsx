import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { BookOpen, Users, Award, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

const Landing = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        api.get('/courses/').then(res => setCourses(res.data)).catch(() => { });
    }, []);

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <div style={{
                padding: '6rem 0 4rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)'
            }}>
                <div className="container fade-in">
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Master Your Future with <span style={{ background: 'linear-gradient(to right, var(--accent), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartLMS</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        Transforming education through technology. Join thousands of students and expert teachers on the world's most advanced learning platform.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Get Started Free</Link>
                        <Link to="/courses" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Browse Courses</Link>
                    </div>
                </div>
            </div>

            {/* Portal Selection (The requested 2 sections) */}
            <div className="container" style={{ margin: '4rem auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Choose Your Path</h2>
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '3rem' }}>

                    {/* Student Section */}
                    <div className="card fade-in" style={{ padding: '3rem', cursor: 'default', border: '1px solid var(--accent)' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                            <GraduationCap size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Student Portal</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Access world-class content, track your progress, and earn certifications that matter. Your journey to excellence starts here.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem', color: 'var(--text-main)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><ShieldCheck size={18} color="var(--accent)" /> Interactive Quizzes</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><ShieldCheck size={18} color="var(--accent)" /> Personalized Dashboard</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><ShieldCheck size={18} color="var(--accent)" /> Certificate of Completion</li>
                        </ul>
                        <Link to="/register" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Join as Student</Link>
                    </div>

                    {/* Teacher Section */}
                    <div className="card fade-in" style={{ padding: '3rem', cursor: 'default', border: '1px solid #8b5cf6' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#8b5cf6' }}>
                            <Briefcase size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Teacher Portal</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Share your expertise with the world. Powerful tools to build, manage, and scale your online teaching business.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem', color: 'var(--text-main)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><Award size={18} color="#8b5cf6" /> Course Builder Pro</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><Award size={18} color="#8b5cf6" /> Student Analytics</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><Award size={18} color="#8b5cf6" /> Automated Grading</li>
                        </ul>
                        <Link to="/register" className="btn btn-secondary" style={{ width: '100%', fontSize: '1.1rem', borderColor: '#8b5cf6', color: '#8b5cf6' }}>Become a Teacher</Link>
                    </div>

                </div>
            </div>

            {/* Featured Courses */}
            <div className="container" style={{ margin: '6rem auto 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>Featured Courses</h2>
                    <Link to="/courses" style={{ color: 'var(--accent)', fontWeight: '600' }}>View All Courses →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {courses.length > 0 ? courses.slice(0, 3).map(course => (
                        <div key={course.id} className="card fade-in">
                            <div style={{ position: 'relative', height: '180px', background: 'var(--primary-dark)', borderRadius: '0.5rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        <BookOpen size={48} />
                                    </div>
                                )}
                            </div>
                            <h3>{course.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{course.description.substring(0, 100)}...</p>
                            <Link to={`/courses/${course.id}`} className="btn btn-secondary" style={{ width: '100%' }}>View Details</Link>
                        </div>
                    )) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            <p>Loading premium courses...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Why Us */}
            <div style={{ background: 'var(--primary-dark)', padding: '6rem 0', margin: '4rem 0' }}>
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '4rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>10k+</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Active Students</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '3rem', color: '#8b5cf6', marginBottom: '0.5rem' }}>500+</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Expert Teachers</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>1.2k+</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Premium Courses</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;
