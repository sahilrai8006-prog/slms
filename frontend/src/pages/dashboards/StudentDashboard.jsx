import React, { useEffect, useState } from 'react';
import { Award, BookOpen, GraduationCap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import Navbar from '../../components/Navbar';

const StudentDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [selectedCert, setSelectedCert] = useState(null);
    const [stats, setStats] = useState({
        completed: 0,
        inProgress: 0,
        totalCourses: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollRes, certRes] = await Promise.all([
                    api.get('/enrollments/'),
                    api.get('/certificates/')
                ]);

                setEnrollments(enrollRes.data);
                setCertificates(certRes.data);

                const completedCount = enrollRes.data.filter(e => e.progress_percentage === 100).length;
                const inProgressCount = enrollRes.data.length - completedCount;

                setStats({
                    totalCourses: enrollRes.data.length,
                    completed: completedCount,
                    inProgress: inProgressCount
                });

                // Fetch user info if missing in localStorage (needed for certificate name)
                if (!localStorage.getItem('first_name')) {
                    const userRes = await api.get('/users/me/');
                    localStorage.setItem('username', userRes.data.username);
                    localStorage.setItem('first_name', userRes.data.first_name || '');
                    localStorage.setItem('last_name', userRes.data.last_name || '');
                }
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Student Learning Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track your progress and continue your journey.</p>
                </div>
                <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{enrollments.length} Enrolled Courses</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>{stats.totalCourses}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Courses</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.inProgress}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981' }}>{stats.completed}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.length > 0 ? (
                    enrollments.map(enrol => (
                        <div key={enrol.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem', color: 'var(--accent)', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.1em' }}>ENROLLED</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{enrol.course?.title || 'Unknown Course'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flexGrow: 1 }}>
                                Enrolled on {new Date(enrol.enrolled_at).toLocaleDateString()}
                            </p>

                            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span>Progress</span>
                                    <span>{enrol.progress_percentage}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--primary-light)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${enrol.progress_percentage}%`, height: '100%', background: 'linear-gradient(to right, var(--accent), #8b5cf6)', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>

                            <Link to={`/courses/${enrol.course?.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                                Go to Module
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                        <h3>No Active Enrollments</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            You haven't joined any courses yet. Start your learning journey today and master new skills.
                        </p>
                        <Link to="/courses" className="btn btn-primary">
                            Explore All Courses
                        </Link>
                    </div>
                )}
            </div>
            <h2 style={{ marginTop: '4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award color="var(--accent)" /> My Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {certificates.length > 0 ? (
                    certificates.map(cert => (
                        <div key={cert.id} className="card" style={{ border: '1px solid var(--accent)', background: 'linear-gradient(135deg, var(--primary) 0%, rgba(56, 189, 248, 0.05) 100%)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>
                                    <GraduationCap size={24} color="var(--accent)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{cert.course_name}</h4>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Issued on {new Date(cert.issued_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', background: 'var(--primary-dark)', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                ID: {cert.certificate_id}
                            </div>
                            <button
                                onClick={() => setSelectedCert(cert)}
                                className="btn btn-secondary"
                                style={{ width: '100%', fontSize: '0.8rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                            >
                                View Certificate
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>
                        <p>Complete a course to earn your first certificate! 🏆</p>
                    </div>
                )}
            </div>

            {/* Certificate Modal */}
            {selectedCert && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        maxWidth: '800px', width: '100%', background: '#fff', color: '#1a1a1a',
                        padding: '3rem', borderRadius: '2px', position: 'relative',
                        border: '15px solid #d4af37', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        backgroundImage: 'radial-gradient(circle at center, #fff 0%, #f9f9f9 100%)'
                    }}>
                        <div className="no-print" style={{ position: 'absolute', top: '-50px', right: '0', display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => window.print()}
                                className="btn"
                                style={{ background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                📥 Download PDF
                            </button>
                            <button
                                onClick={() => setSelectedCert(null)}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '2rem' }}
                            >
                                ✕
                            </button>
                        </div>

                        <style>{`
                            @media print {
                                @page { size: landscape; margin: 0; }
                                body { background: #fff !important; margin: 0; padding: 0; }
                                .no-print { display: none !important; }
                                
                                /* Complete separation for printing */
                                body * { visibility: hidden !important; }
                                #certificate-print-area, #certificate-print-area * { visibility: visible !important; }
                                
                                #certificate-print-area {
                                    position: fixed !important;
                                    left: 0 !important;
                                    top: 0 !important;
                                    width: 100vw !important;
                                    height: 100vh !important;
                                    background: #fff !important;
                                    display: flex !important;
                                    flex-direction: column !important;
                                    justify-content: center !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    border: 25px solid #d4af37 !important;
                                    box-sizing: border-box !important;
                                    z-index: 99999 !important;
                                    -webkit-print-color-adjust: exact !important;
                                    print-color-adjust: exact !important;
                                }
                                
                                #certificate-content {
                                    border: 2px solid #d4af37 !important;
                                    margin: 40px !important;
                                    padding: 40px !important;
                                    height: calc(100% - 80px) !important;
                                    display: flex !important;
                                    flex-direction: column !important;
                                    justify-content: center !important;
                                }
                            }
                        `}</style>

                        <div id="certificate-print-area">
                            <div id="certificate-content" style={{ textAlign: 'center', border: '2px solid #d4af37', padding: '2.5rem' }}>
                                <div style={{ fontSize: '3rem', color: '#d4af37', marginBottom: '1rem' }}>🏆</div>
                                <h1 style={{ fontFamily: 'serif', fontSize: '3.5rem', margin: '0 0 1rem', color: '#1a1a1a' }}>Certificate</h1>
                                <p style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 2rem' }}>of Excellence</p>

                                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', margin: '0 0 1rem' }}>This is to certify that</p>
                                <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem', borderBottom: '2px solid #1a1a1a', display: 'inline-block', padding: '0 2rem', color: '#1a1a1a' }}>
                                    {localStorage.getItem('first_name') ? `${localStorage.getItem('first_name')} ${localStorage.getItem('last_name')}` : localStorage.getItem('username')}
                                </h2>

                                <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>has successfully completed the course</p>
                                <h3 style={{ fontSize: '2rem', color: '#d4af37', margin: '0 0 2rem' }}>{selectedCert.course_name}</h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'flex-end', padding: '0 2rem' }}>
                                    {/* Instructor Signature */}
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{
                                            fontFamily: '"Cursive", "Brush Script MT", cursive',
                                            fontSize: '2rem',
                                            color: '#dc2626',
                                            marginBottom: '-0.5rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Sahil Rai
                                        </div>
                                        <div style={{ borderTop: '2px solid #1a1a1a', width: '180px', paddingTop: '0.25rem' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>Authorized Instructor</p>
                                        </div>
                                    </div>

                                    {/* CEO Signature */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontFamily: '"Cursive", "Brush Script MT", cursive',
                                            fontSize: '2rem',
                                            color: '#1d4ed8',
                                            marginBottom: '-0.5rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Amit Patel
                                        </div>
                                        <div style={{ borderTop: '2px solid #1a1a1a', width: '180px', paddingTop: '0.25rem' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>CEO, SmartLMS</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', opacity: 0.8 }}>
                                    <p style={{ fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Issued on: {new Date(selectedCert.issued_at).toLocaleDateString()}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'monospace', letterSpacing: '1px' }}>VERIFICATION ID: {selectedCert.certificate_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
