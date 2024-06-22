import React from 'react';
import Login from './components/Login';
import DataCompany from './components/DataCompany';
import BelumLogin from './auth/BelumLogin';
import SudahLogin from './auth/SudahLogin';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-superadmin" />} />
          <Route path="/login-superadmin" element={
          <SudahLogin>
            <Login />
          </SudahLogin> 
        }/>
          <Route path="/data-company" element={
          <BelumLogin>
            <DataCompany />
          </BelumLogin>
        }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
