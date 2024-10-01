import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  return user?.token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;