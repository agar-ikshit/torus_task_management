import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', password: '',email:'',isAdmin:false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
       const payload = {
      ...userData,
      isAdmin: userData.isAdmin === 'true' // convert to boolean
    };
    await register(userData);
    toast.success("User registered successfully");
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" type = "email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <small style={{ color: 'gray', fontSize: '12px' }}>
 minimum characters required: 6
</small>
        <br></br><br></br>
      <label>Select Role:</label><br />
          <label>
            <input
              type="radio"
              name="isAdmin"
              value="false"
              checked={userData.isAdmin === 'false'}
              onChange={handleChange}
            />
            User
          </label>{' '}
          <label>
            <input
              type="radio"
              name="isAdmin"
              value="true"
              checked={userData.isAdmin === 'true'}
              onChange={handleChange}
            />
            Admin
          </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
