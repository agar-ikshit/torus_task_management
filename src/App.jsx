import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Common/Navbar';
import PrivateRoute from './components/Common/PrivateRoute'; 
import Modal from 'react-modal';
import './index.css';

Modal.setAppElement('#root'); 

const App = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  return (
    <>
      <ToastContainer />

      <Modal
  isOpen={showWelcomeModal}
  onRequestClose={() => setShowWelcomeModal(false)}
  contentLabel="Welcome Message"
  style={{
    content: {
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '10px',
    },
  }}
>
  <h2> Welcome to Torus task management!</h2>
  
  <p>
     <strong>Please register first</strong> to start using the app.
    The backend is hosted on Render, so the <strong>first request might take a minute</strong> to start.
  </p>
  
  <p >Here’s what you can do:</p>
  <ul >
    <li>1: Add new tasks and update their status</li>
    <li>2: If you're an admin, assign tasks to others</li>
    <li>3: View and track your task list easily</li>
    <li>4: Generate a summary of all your tasks</li>
  </ul>

  <p><strong>Security & tech under the hood:</strong></p>
  <ul>
    <li><strong>JWT authentication</strong> to keep your data secure</li>
    <li><strong>Context Provider</strong> to manage and share authentication state</li>
  </ul>
   <p ><strong>Project links:</strong></p>
  <ul>
    <li>
      Frontend GitHub: <a href="https://github.com/agar-ikshit/torus_task_management" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://github.com/agar-ikshit/torus_task_management</a>
    </li>
    <li>
      Backend GitHub: <a href="https://github.com/agar-ikshit/torus_backend" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://github.com/agar-ikshit/torus_backend</a>
    </li>
  </ul>


  <button
    onClick={() => setShowWelcomeModal(false)}
   
  >
    Got it!
  </button>
</Modal>


      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} className="routes" />
            <Route path="/register" element={<Register />} className="routes" />
            <Route path="/tasks" element={<PrivateRoute element={<TaskList />} />} className="routes" /> 
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
