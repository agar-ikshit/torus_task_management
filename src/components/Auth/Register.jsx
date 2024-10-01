import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', password: '',email:'',isAdmin:'' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(userData);
    toast.success("User registered successfully");
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" type = "email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="isAdmin" placeholder="isAdmin" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
