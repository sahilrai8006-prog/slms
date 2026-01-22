import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Video, FileText, ArrowLeft, Save } from 'lucide-react';

const CourseBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/courses/${id}/`);
                setCourse(res.data);
                setModules(res.data.modules || []);
            } catch (err) {
                console.error(err);
                alert("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const addModule = async () => {
        const title = prompt("Enter Module Title:");
        if (!title) return;
        try {
            const res = await api.post('/modules/', { title, course: id });
            setModules([...modules, { ...res.data, lessons: [] }]);
        } catch (err) {
            alert("Failed to add module");
        }
    };

    const addLesson = async (moduleId) => {
        const title = prompt("Enter Lesson Title:");
        if (!title) return;
        const video_url = prompt("Enter YouTube Video URL (optional):");
        const content = prompt("Enter Lesson Content/Description:");

        try {
            const res = await api.post('/lessons/', {
                title,
                module: moduleId,
                video_url: video_url || '',
                content: content || 'No content provided'
            });

            setModules(modules.map(mod => {
                if (mod.id === moduleId) {
                    return { ...mod, lessons: [...(mod.lessons || []), res.data] };
                }
                return mod;
            }));
        } catch (err) {
            alert("Failed to add lesson");
        }
    };

    const deleteModule = async (moduleId) => {
        if (window.confirm("Delete this module and all its lessons?")) {
            try {
                await api.delete(`/modules/${moduleId}/`);
                setModules(modules.filter(m => m.id !== moduleId));
            } catch (err) {
                alert("Failed to delete module");
            }
        }
    };

    const deleteLesson = async (moduleId, lessonId) => {
        if (window.confirm("Delete this lesson?")) {
            try {
                await api.delete(`/lessons/${lessonId}/`);
                setModules(modules.map(mod => {
                    if (mod.id === moduleId) {
                        return { ...mod, lessons: mod.lessons.filter(l => l.id !== lessonId) };
                    }
                    return mod;
                }));
            } catch (err) {
                alert("Failed to delete lesson");
            }
        }
    };

    if (loading) return <div className="container"><h2>Loading Builder...</h2></div>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '3rem', paddingBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1>Course Builder: {course?.title}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Create your curriculum and add YouTube video lessons.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    {modules.map((module, mIdx) => (
                        <div key={module.id} className="card" style={{ padding: '0', overflow: 'visible' }}>
                            <div style={{ padding: '1.5rem', background: 'var(--primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1rem 1rem 0 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Module {mIdx + 1}: {module.title}</h3>
                                    <button onClick={() => deleteModule(module.id)} className="btn" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <button onClick={() => addLesson(module.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    <Plus size={16} /> Add Lesson
                                </button>
                            </div>

                            <div style={{ padding: '1rem' }}>
                                {module.lessons && module.lessons.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {module.lessons.map((lesson, lIdx) => (
                                            <div key={lesson.id} className="card" style={{ padding: '1rem', background: 'var(--primary)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ color: 'var(--accent)' }}>
                                                        {lesson.video_url ? <Video size={20} /> : <FileText size={20} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{lesson.title}</div>
                                                        {lesson.video_url && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                Video: {lesson.video_url}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button onClick={() => deleteLesson(module.id, lesson.id)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '0.5rem' }}>
                                        No lessons in this module. Click "Add Lesson" to start.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button onClick={addModule} className="btn btn-secondary" style={{ padding: '1.5rem', borderStyle: 'dashed', borderWidth: '2px', fontSize: '1.1rem' }}>
                        <Plus size={24} /> Create New Module
                    </button>
                </div>
            </div>
        </>
    );
};

export default CourseBuilder;
