import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { BookOpen, Users, Award, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

const Landing = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const role = localStorage.getItem('role');

    const categories = ['All', 'Programming', 'Design', 'Business', 'DevOps', 'Other'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get('/courses/');
                setCourses(courseRes.data);
                setFilteredCourses(courseRes.data);

                if (role === 'Student') {
                    const enrollRes = await api.get('/enrollments/');
                    setEnrollments(enrollRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [role]);

    useEffect(() => {
        const filtered = courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredCourses(filtered);
    }, [searchTerm, selectedCategory, courses]);

    const isEnrolled = (courseId) => {
        return enrollments.some(e => {
            const id = typeof e.course === 'object' ? e.course.id : e.course;
            return id === courseId;
        });
    };

    const handleEnroll = async (courseId) => {
        if (!role) {
            window.location.href = '/login';
            return;
        }
        try {
            await api.post('/enrollments/', { course: courseId });
            const enrollRes = await api.get('/enrollments/');
            setEnrollments(enrollRes.data);
            alert("Enrolled successfully!");
        } catch (err) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : "Enrollment failed.";
            alert(msg);
        }
    };

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

            {/* Course Explorer */}
            <div className="container" style={{ margin: '6rem auto 4rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', textAlign: 'center' }}>Explore Our Curriculum</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px', marginBottom: '3rem' }}>
                        Discover world-class courses designed to help you master new skills and advance your career.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search for courses (e.g. React, Python)..."
                                style={{ padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '50px', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem' }}>🔍</div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '50px',
                                        border: '1px solid var(--border)',
                                        background: selectedCategory === cat ? 'var(--accent)' : 'var(--primary-light)',
                                        color: selectedCategory === cat ? '#fff' : 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: selectedCategory === cat ? '0 10px 15px -3px rgba(56, 189, 248, 0.4)' : 'none'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.length > 0 ? filteredCourses.map(course => (
                        <div key={course.id} className="card fade-in" style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease forwards' }}>
                            <div style={{ position: 'relative', height: '200px', background: 'var(--primary-dark)', borderRadius: '1rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '0.35rem 1rem', borderRadius: '50px', fontSize: '0.75rem', color: '#fff', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    {course.category}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{course.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>{course.description.substring(0, 120)}...</p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <Link to={`/courses/${course.id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', borderRadius: '0.75rem' }}>Details</Link>
                                {role === 'Student' && (
                                    isEnrolled(course.id) ? (
                                        <button className="btn" disabled style={{ flex: 1.5, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', cursor: 'default', borderRadius: '0.75rem' }}>Enrolled</button>
                                    ) : (
                                        <button onClick={() => handleEnroll(course.id)} className="btn btn-primary" style={{ flex: 1.5, borderRadius: '0.75rem' }}>Enroll Now</button>
                                    )
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔎</div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>No matches found</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't find any courses matching your search or category selection.</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="btn btn-primary">Reset Filters</button>
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
