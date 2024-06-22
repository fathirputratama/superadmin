import React, { useState } from 'react';
import image from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import { MdMailOutline, MdOutlineAdminPanelSettings } from 'react-icons/md';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('https://7935-182-253-158-19.ngrok-free.app/superadmin/loginsuperadmin', { email, password })
      .then((result) => {
        console.log(result);
        const { data } = result;
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/data-company');
          Swal.fire({
            icon: 'success',
            title: 'Login berhasil!',
            text: 'Anda berhasil login sebagai super admin.',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Terjadi kesalahan saat login. Silakan coba lagi');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-3/5 xl:3/4 bg-gray-100 p-4 hidden md:flex md:items-center md:justify-center">
        <img src={image} alt="login" className="w-[500px] h-auto" />
      </div>
      <div className="w-full h-full md:w-1/2 flex items-center justify-center shadow-lg">
        <form className="w-full max-w-md bg-white p-4 rounded" onSubmit={handleSubmit}>
          <div className="flex justify-center items-center gap-1 mb-1 md:mb-2 text-teal-700">
            <MdOutlineAdminPanelSettings className="text-4xl md:text-5xl" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center">Super Admin</h2>
          </div>
          <h5 className="text-center font-medium mb-1 text-gray-800">Masukkan akun Super Admin</h5>
          {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
          <div className="mt-6 mb-3 relative">
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="appearance-none rounded-lg w-full py-2 px-3 pr-10 bg-gray-100 focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800"
                placeholder="Masukkan email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <MdMailOutline />
              </span>
            </div>
          </div>
          <div className="mb-6 relative">
            <label className="block text-sm font-semibold mb-1" htmlFor="sandi">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="sandi"
                className="appearance-none rounded-lg w-full py-2 px-3 pr-10 bg-gray-100 mb-1 focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800"
                placeholder="Masukkan kata sandi"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>
          <button type="submit" className="bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold w-full py-2 px-4 rounded-lg focus:outline-none">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
