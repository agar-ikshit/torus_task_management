import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Common/Navbar';
import PrivateRoute from './components/Common/PrivateRoute'; 
import './index.css';

const App = () => {
  return (
    <>
    <ToastContainer />

    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} className = "routes" />
          <Route path="/register" element={<Register />}  className = "routes"/>
          <Route path="/tasks" element={<PrivateRoute element={<TaskList />} />} className = "routes" /> 
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;
