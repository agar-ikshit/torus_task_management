    import React, { useContext, useState } from 'react';
    import { AuthContext } from '../../context/AuthContext';
    import { useNavigate } from 'react-router-dom';
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

    const Login = () => {
    const { login } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(credentials);
        toast.success('Login Successfull');
        navigate('/tasks');
    };

    return (
        <form onSubmit={handleSubmit}>
        <input name="email" placeholder="email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        </form>
    );
    };

export default Login;
