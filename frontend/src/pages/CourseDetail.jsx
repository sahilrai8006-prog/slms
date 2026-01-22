import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { PlayCircle, Clock, CheckCircle, Lock, ArrowLeft, Users, FileText, MessageSquare, Bell, HelpCircle } from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [activeTab, setActiveTab] = useState('content'); // content, announcements, quiz, discussion
    const [newComment, setNewComment] = useState('');
    const role = localStorage.getItem('role');

    // ... fetchData logic ...

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment || !activeLesson) return;
        try {
            const res = await api.post('/comments/', { lesson: activeLesson.id, text: newComment });
            const updatedCourse = { ...course };
            // Update the local state for immediate feedback
            updatedCourse.modules = updatedCourse.modules.map(m => ({
                ...m,
                lessons: m.lessons.map(l => l.id === activeLesson.id ? { ...l, comments: [...(l.comments || []), res.data] } : l)
            }));
            setCourse(updatedCourse);
            // Also update activeLesson if it's the one we're commenting on
            setActiveLesson({ ...activeLesson, comments: [...(activeLesson.comments || []), res.data] });
            setNewComment('');
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}/`);
                setCourse(res.data);

                if (role === 'Student') {
                    const [enrollRes, completionRes] = await Promise.all([
                        api.get('/enrollments/'),
                        api.get('/lesson-completions/')
                    ]);

                    const alreadyEnrolled = enrollRes.data.some(e => {
                        const courseId = typeof e.course === 'object' ? e.course.id : e.course;
                        return courseId === parseInt(id);
                    });
                    setIsEnrolled(alreadyEnrolled);
                    setCompletedLessons(completionRes.data.map(c => c.lesson));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, role]);

    const handleEnroll = async () => {
        if (!role) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/enrollments/', { course: id });
            setIsEnrolled(true);
            alert("Enrolled successfully!");
        } catch (err) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : "Enrollment failed.";
            alert(msg);
        }
    };

    const handleMarkAsRead = async () => {
        if (!activeLesson) return;
        try {
            await api.post('/lesson-completions/', { lesson: activeLesson.id });
            setCompletedLessons([...completedLessons, activeLesson.id]);
            alert("Lesson marked as completed!");
        } catch (err) {
            alert("Already marked or error occurred.");
        }
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    if (loading) return <div className="container" style={{ marginTop: '5rem', textAlign: 'center' }}><h2>Loading Course...</h2></div>;
    if (!course) return <div className="container" style={{ marginTop: '5rem', textAlign: 'center' }}><h2>Course Not Found</h2></div>;

    return (
        <>
            <Navbar />

            {/* Header / Hero */}
            <div style={{ background: 'var(--primary-dark)', padding: '4rem 0 3rem', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: '600' }}>
                        <ArrowLeft size={18} /> Back to Courses
                    </button>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3rem',
                        alignItems: 'start'
                    }}>
                        <div>
                            <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>
                                Featured Course
                            </div>
                            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{course.title}</h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {course.description}
                            </p>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                            <div style={{ width: '100%', height: '180px', background: 'var(--primary-light)', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PlayCircle size={64} color="var(--accent)" />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Free</div>
                            {isEnrolled ? (
                                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: '600' }}>✓ You are enrolled</div>
                            ) : (
                                <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Enroll Now</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '4rem', paddingBottom: '6rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Left Side: Content or Video Player */}
                    <div>
                        {activeLesson ? (
                            <div className="fade-in">
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', overflowX: 'auto' }}>
                                    {[
                                        { id: 'content', label: 'Lesson', icon: <PlayCircle size={18} /> },
                                        { id: 'announcements', label: 'Updates', icon: <Bell size={18} /> },
                                        { id: 'discussion', label: 'Discussion', icon: <MessageSquare size={18} /> },
                                        { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={18} /> }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                                                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                                                border: 'none', padding: '0.6rem 1.25rem', borderRadius: '50px',
                                                cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'content' && (
                                    <div className="fade-in">
                                        <h2 style={{ marginBottom: '1.5rem' }}>{activeLesson.title}</h2>
                                        {activeLesson.video_url && getYoutubeEmbedUrl(activeLesson.video_url) ? (
                                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '1rem', background: '#000', marginBottom: '2rem' }}>
                                                <iframe
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                    src={getYoutubeEmbedUrl(activeLesson.video_url)}
                                                    title={activeLesson.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                                                <FileText size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                                                <p>This lesson has no video content.</p>
                                            </div>
                                        )}
                                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ marginBottom: '0.5rem' }}>Lesson Description</h4>
                                                <p style={{ lineHeight: '1.6' }}>{activeLesson.content}</p>
                                            </div>
                                            {isEnrolled && (
                                                completedLessons.includes(activeLesson.id) ? (
                                                    <div style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <CheckCircle size={20} /> Completed
                                                    </div>
                                                ) : (
                                                    <button onClick={handleMarkAsRead} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                                        Mark as Completed
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'announcements' && (
                                    <div className="fade-in">
                                        <h3 style={{ marginBottom: '1.5rem' }}>Course Announcements</h3>
                                        {course.announcements && course.announcements.length > 0 ? course.announcements.map(ann => (
                                            <div key={ann.id} className="card" style={{ marginBottom: '1rem' }}>
                                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{ann.title}</h4>
                                                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{ann.content}</p>
                                                <small style={{ color: 'var(--text-muted)' }}>Posted on {new Date(ann.created_at).toLocaleDateString()}</small>
                                            </div>
                                        )) : <p>No announcements yet.</p>}
                                    </div>
                                )}

                                {activeTab === 'discussion' && (
                                    <div className="fade-in">
                                        <h3 style={{ marginBottom: '1.5rem' }}>Discussion Board</h3>
                                        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2rem' }}>
                                            <textarea
                                                className="input"
                                                placeholder="Write a comment or ask a question..."
                                                style={{ minHeight: '100px', marginBottom: '1rem' }}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            ></textarea>
                                            <button type="submit" className="btn btn-primary">Post Comment</button>
                                        </form>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {activeLesson.comments && activeLesson.comments.length > 0 ? activeLesson.comments.map(comment => (
                                                <div key={comment.id} className="card" style={{ background: 'var(--primary-light)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{comment.username}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(comment.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.9rem' }}>{comment.text}</p>
                                                </div>
                                            )) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No comments yet. Be the first to start the conversation!</p>}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'quiz' && (
                                    <div className="fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <HelpCircle size={64} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                                        <h3>Ready for a Quick Quiz?</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Test your knowledge on the concepts covered in this module.</p>
                                        <button className="btn btn-primary" onClick={() => alert("Quiz starting soon! (Interactive Quiz Engine loading...)")}>Start Quiz</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h2 style={{ marginBottom: '2rem' }}>Course Overview</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>{course.description}</p>
                                <div className="card" style={{ marginTop: '2rem', background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed var(--border)' }}>
                                    <p style={{ textAlign: 'center' }}>Select a lesson from the curriculum to start learning.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Curriculum */}
                    <div>
                        <h3 style={{ marginBottom: '1.5rem' }}>Curriculum</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {course.modules && course.modules.map((module, idx) => (
                                <div key={module.id} className="card" style={{ padding: '0' }}>
                                    <div style={{ padding: '1rem', background: 'var(--primary-light)', fontSize: '0.9rem', fontWeight: '700' }}>
                                        {idx + 1}. {module.title}
                                    </div>
                                    <div>
                                        {module.lessons && module.lessons.map(lesson => (
                                            <div
                                                key={lesson.id}
                                                onClick={() => isEnrolled && setActiveLesson(lesson)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    cursor: isEnrolled ? 'pointer' : 'not-allowed',
                                                    borderTop: '1px solid var(--border)',
                                                    background: activeLesson?.id === lesson.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                                                }}
                                            >
                                                {isEnrolled ? (
                                                    completedLessons.includes(lesson.id) ? (
                                                        <CheckCircle size={16} color="#10b981" />
                                                    ) : (
                                                        lesson.video_url ? <PlayCircle size={16} color="var(--accent)" /> : <FileText size={16} />
                                                    )
                                                ) : (
                                                    <Lock size={16} color="var(--text-muted)" />
                                                )}
                                                <span style={{
                                                    fontSize: '0.875rem',
                                                    color: isEnrolled ? 'var(--text-main)' : 'var(--text-muted)',
                                                    textDecoration: completedLessons.includes(lesson.id) ? 'line-through' : 'none',
                                                    opacity: completedLessons.includes(lesson.id) ? 0.6 : 1
                                                }}>
                                                    {lesson.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
