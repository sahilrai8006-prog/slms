import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        if (!role) {
            navigate('/login');
        }
    }, [role, navigate]);

    const renderDashboard = () => {
        switch (role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'Teacher':
                return <TeacherDashboard />;
            case 'Student':
                return <StudentDashboard />;
            default:
                return (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h2>Access Denied</h2>
                        <p>You do not have a valid role assigned. Please contact support.</p>
                    </div>
                );
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '2.5rem', paddingBottom: '5rem' }}>
                {renderDashboard()}
            </div>
        </>
    );
};

export default Dashboard;

