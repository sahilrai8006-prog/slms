import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        api.get(`/courses/${id}/`).then(res => setCourse(res.data));
    }, [id]);

    if (!course) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="card">
                    <h1>{course.title}</h1>
                    <p className="label">Instructor: {course.instructor_name}</p>
                    <p>{course.description}</p>
                </div>

                <h2 style={{ marginTop: '2rem' }}>Modules</h2>
                <div className="grid grid-cols-1">
                    {course.modules && course.modules.map(module => (
                        <div key={module.id} className="card">
                            <h3>{module.title}</h3>
                            <ul>
                                {module.lessons && module.lessons.map(lesson => (
                                    <li key={lesson.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                        {lesson.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
