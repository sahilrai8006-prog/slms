import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';

import CreateCourse from './pages/CreateCourse';
import CourseBuilder from './pages/CourseBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/manage-course/:id" element={<CourseBuilder />} />
        <Route path="/courses" element={<Landing />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/admin" element={<Dashboard />} /> {/* Admin also uses Dashboard logic */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

