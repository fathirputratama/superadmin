import { Navigate } from 'react-router-dom';

const SudahLogin = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/data-company" /> : children;
};

export default SudahLogin;
