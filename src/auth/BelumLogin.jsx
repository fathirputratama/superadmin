import { Navigate } from 'react-router-dom';

const BelumLogin = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login-superadmin" />;
};

export default BelumLogin;
