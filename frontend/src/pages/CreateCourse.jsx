import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { Save, Plus, Trash2, Layout } from 'lucide-react';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/courses/', courseData);
            alert("Course created successfully! Now you can manage modules from the dashboard.");
            navigate('/dashboard');
        } catch (err) {
            console.error("Full error response:", err.response);
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Please fill all required fields.";
            alert("Failed to create course: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '4rem', maxWidth: '800px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>Create New Course</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to launch your course on SmartLMS.</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Course Title</label>
                            <input
                                className="input"
                                placeholder="e.g. Master React in 30 Days"
                                value={courseData.title}
                                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="label">Course Description</label>
                            <textarea
                                className="input"
                                rows="6"
                                placeholder="Describe what students will learn..."
                                value={courseData.description}
                                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                style={{ resize: 'vertical' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 2 }}
                                disabled={loading}
                            >
                                <Save size={18} /> {loading ? 'Creating...' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Card */}
                <div className="card" style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(56, 189, 248, 0.05)', border: '1px dashed var(--accent)' }}>
                    <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem', color: 'var(--accent)' }}>
                        <Layout size={32} />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>Pro Tip: Modules & Lessons</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            After creating the course base, you can go to your dashboard to add interactive modules and video lessons.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;
