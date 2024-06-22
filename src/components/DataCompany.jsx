import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCircle, MdOutlineDeleteSweep } from 'react-icons/md';
import { TbEdit, TbTrash, TbLogout } from 'react-icons/tb';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaPhone, FaBuilding, FaMapLocationDot  } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import axios from 'axios';

const DataCompany = () => {
  const navigate = useNavigate();

  const [showFormTambahCompany, setFormTambahCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [namaCreate, setNamaCreate] = useState('');
  const [emailCreate, setEmailCreate] = useState('');
  const [alamatCreate, setAlamatCreate] = useState('');
  const [nomorCreate, setNomorCreate] = useState('');
  const [passwordCreate, setPasswordCreate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showFormEditStatus, setShowFormEditStatus] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStatus, setNewStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [hoveredCompanyAddress, setHoveredCompanyAddress] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login ulang.');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      };

      const response = await axios.get('https://7935-182-253-158-19.ngrok-free.app/superadmin/data', { headers });
      if (response.data.status && Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
      } else {
        setError('Data yang diterima tidak valid');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('Token kedaluwarsa. Silakan login ulang.');
        localStorage.removeItem('token');
        navigate('/login-superadmin');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    cancelLogout();
    navigate('/login-superadmin');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleFormTambahCompany = () => {
    setFormTambahCompany(true);
  };

  const handleCloseTambahCompany = () => {
    setFormTambahCompany(false);
    setNamaCreate('');
    setEmailCreate('');
    setAlamatCreate('');
    setNomorCreate('');
    setPasswordCreate('');
  };

  const handleSubmitTambahCompany = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login ulang.');
        setLoading(false);
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      };
      const newCompany = {
        nama: namaCreate,
        email: emailCreate,
        alamat: alamatCreate,
        no_telp: nomorCreate,
        password: passwordCreate,
      };

      const response = await axios.post('https://7935-182-253-158-19.ngrok-free.app/company/addcompany', newCompany, { headers });
      if (response.data.status) {
        handleCloseTambahCompany();
        fetchData();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data perusahaan berhasil ditambahkan!',
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        setError('Gagal menambahkan data perusahaan');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email tersebut sudah digunakan oleh perusahaan lain',
          showConfirmButton: true,
        });
      } else {
        setError(error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormEditStatus = (company) => {
    setCurrentCompany(company);
    setNewStatus(company.status);
    setShowFormEditStatus(true);
  };

  const handleCloseEditStatus = () => {
    setShowFormEditStatus(false);
    setCurrentCompany(null);
    setNewStatus(false);
  };

  const handleSubmitEditStatus = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan.');
        return;
      }

      if (newStatus === currentCompany.status) {
        setShowFormEditStatus(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      };

      const updatedCompany = { ...currentCompany, status: newStatus };

      const response = await axios.put(`https://7935-182-253-158-19.ngrok-free.app/superadmin/company/${currentCompany._id}/status`, updatedCompany, { headers });
      if (response.data.status) {
        setCompanies(companies.map((company) => (company._id === currentCompany._id ? updatedCompany : company)));
        setShowFormEditStatus(false);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Status perusahaan berhasil diubah!',
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        setError('Gagal mengubah status perusahaan');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteCompany = async (company) => {
    const confirmed = await Swal.fire({
      title: 'Apakah Anda yakin?',
      html: `Anda akan menghapus perusahaan <strong>${company.nama}</strong>. Tindakan ini tidak bisa dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'rgb(15 118 110)',
      confirmButtonText: 'Hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token tidak ditemukan. Silakan login ulang.');
          setLoading(false);
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        };

        const response = await axios.delete(`https://7935-182-253-158-19.ngrok-free.app/superadmin/deletecompany/${company.guid_company}`, { headers });
        if (response.data.status) {
          const updatedCompanies = companies.filter((c) => c.guid_company !== company.guid_company);
          setCompanies(updatedCompanies);

          const totalPagesAfterDelete = Math.ceil(updatedCompanies.length / itemsPerPage);
          if (currentPage > totalPagesAfterDelete) {
            setCurrentPage(totalPagesAfterDelete || 1);
          }

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Perusahaan berhasil dihapus!',
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          setError('Gagal menghapus perusahaan');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanies((prevSelectedCompanies) => (prevSelectedCompanies.includes(companyId) ? prevSelectedCompanies.filter((id) => id !== companyId) : [...prevSelectedCompanies, companyId]));
  };

  const handleDeleteSelectedCompanies = async () => {
    const confirmed = await Swal.fire({
      title: 'Apakah Anda yakin?',
      html: `Anda akan menghapus ${selectedCompanies.length} perusahaan yang dipilih. Tindakan ini tidak bisa dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'rgb(15 118 110)',
      confirmButtonText: 'Hapus!',
      cancelButtonText: 'Batal',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token tidak ditemukan. Silakan login ulang.');
          setLoading(false);
          return;
        }
        const headers = {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        };

        const deletePromises = selectedCompanies.map((companyId) => axios.delete(`https://7935-182-253-158-19.ngrok-free.app/superadmin/deletecompany/${companyId}`, { headers }));

        const responses = await Promise.all(deletePromises);

        if (responses.every((response) => response.data.status)) {
          const updatedCompanies = companies.filter((c) => !selectedCompanies.includes(c.guid_company));
          setCompanies(updatedCompanies);
          setSelectedCompanies([]);

          const totalPagesAfterDelete = Math.ceil(updatedCompanies.length / itemsPerPage);
          if (currentPage > totalPagesAfterDelete) {
            setCurrentPage(totalPagesAfterDelete || 1);
          }

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Perusahaan berhasil dihapus!',
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          setError('Gagal menghapus satu atau lebih perusahaan');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearchQuery =
      company.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.alamat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusFilter = statusFilter === '' || company.status.toString() === statusFilter;
    return matchesSearchQuery && matchesStatusFilter;
  });

  const itemsPerPageOptions = [5, 8, 10, 20];
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const currentItems = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    let timer;
    if (hoveredCompanyAddress && hoveredCompanyAddress.length > 28) {
      timer = setTimeout(() => {
        Swal.fire({
          title: 'Alamat Lengkap',
          text: hoveredCompanyAddress,
          icon: 'info',
          showConfirmButton: true,
          confirmButtonColor: 'rgb(15 118 110)',
        });
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [hoveredCompanyAddress]);

  const handleMouseLeave = () => {
    setHoveredCompanyAddress(null);
  };

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/, (char) => char.toUpperCase());
  };

  return (
    <>
      <nav className="bg-teal-600">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div>
              <h2 className="text-white text-2xl font-semibold">Super Admin</h2>
            </div>
            <div className=" ml-auto">
              <button className="flex justify-center items-center gap-x-0.5 text-white hover:text-slate-200 active:text-slate-300" onClick={handleLogout}>
                <div className="mt-1">
                  <TbLogout />
                </div>
                <h4>Logout</h4>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full pt-1">
        <div className="p-3">
          <div className="px-1 md:flex md:justify-between">
            <input
              type="text"
              className="pl-3 sm:pr-[100px] py-1 mb-2 md:mb-0 rounded-full border border-slate-400"
              placeholder="Cari Perusahaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex justify-end gap-x-2">
              <div className="max-w-sm">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-slate-400 text-sm rounded-xl focus:ring-teal-700 focus:border-teal-700 block w-full"
                >
                  <option value="">Semua Status</option>
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
              <div className="block sm:flex gap-x-2">
                <div className="flex justify-end md:block">
                  <button className="px-3 py-2 text-sm bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-full" onClick={handleFormTambahCompany}>
                    Tambah Perusahaan
                  </button>
                </div>
                <div className="flex justify-end pt-2 md:pt-0">
                  <button
                    className={`w-9 h-9 border border-teal-700 text-teal-700 flex justify-center items-center font-bold rounded-full ${
                      selectedCompanies.length === 0 ? 'hidden' : 'hover:bg-slate-200 active:bg-slate-300'
                    }`}
                    onClick={handleDeleteSelectedCompanies}
                    disabled={selectedCompanies.length === 0}
                  >
                    <MdOutlineDeleteSweep />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {showFormTambahCompany && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-8 w-[500px]">
                <div className="mb-4">
                  <h2 className="text-2xl text-teal-700 font-bold mb-1">Tambah Data Perusahaan</h2>
                  <h5 className="text-sm text-teal-600">Masukkan detail Perusahaan</h5>
                </div>
                <form onSubmit={handleSubmitTambahCompany}>
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      id="namaCreate"
                      className="border-2 border-slate-200 px-4 py-2 rounded-full w-full placeholder-slate-700"
                      placeholder="Nama Perusahaan"
                      value={namaCreate}
                      onChange={(e) => setNamaCreate(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                    <FaBuilding className='text-teal-700'/>
                    </span>
                  </div>
                  <div className="mb-3 relative">
                    <input
                      type="email"
                      id="emailCreate"
                      className="border-2 border-slate-200 px-4 py-2 rounded-full w-full placeholder-slate-700"
                      placeholder="E-mail"
                      value={emailCreate}
                      onChange={(e) => setEmailCreate(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                      <FaEnvelope className='text-teal-700'/>
                    </span>
                  </div>
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      id="alamatCreate"
                      className="border-2 border-slate-200 px-4 py-2 rounded-full w-full placeholder-slate-700"
                      placeholder="Alamat"
                      value={alamatCreate}
                      onChange={(e) => setAlamatCreate(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                      <FaMapLocationDot className='text-teal-700'/>
                    </span>
                  </div>
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      id="nomorCreate"
                      className="border-2 border-slate-200 px-4 py-2 rounded-full w-full placeholder-slate-700"
                      placeholder="Nomor Telepon"
                      value={nomorCreate}
                      onChange={(e) => setNomorCreate(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                      <FaPhone className='text-teal-700'/>
                    </span>
                  </div>
                  <div className="mb-6 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="passwordCreate"
                      className="border-2 border-slate-200 px-4 py-2 rounded-full w-full placeholder-slate-700"
                      placeholder="Password"
                      value={passwordCreate}
                      onChange={(e) => setPasswordCreate(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaRegEye className='text-teal-700'/> : <FaRegEyeSlash className='text-teal-700'/>}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCloseTambahCompany} className="w-1/2 rounded-full font-bold py-2 border border-teal-700 text-teal-700 hover:bg-slate-200 active:bg-slate-300">
                      Batal
                    </button>
                    <button type="submit" className="w-1/2 rounded-full font-bold py-2 text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900">
                      Tambah
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showFormEditStatus && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-8">
                <div className="flex gap-6">
                  <div className="mb-4">
                    <h2 className="text-xl text-teal-700 font-bold mb-1">Edit Data Perusahaan</h2>
                  </div>
                </div>
                <form onSubmit={handleSubmitEditStatus}>
                  <div className="mb-5">
                    <input type="checkbox" id="statusEdit" name="status" checked={newStatus} onChange={(e) => setNewStatus(e.target.checked)} className="mr-2" />
                    <label htmlFor="statusEdit" className="text-slate-700">
                      Status
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handleCloseEditStatus} className="w-1/2 rounded-full font-bold py-2 border border-teal-700 text-teal-700 hover:bg-slate-200 active:bg-slate-300">
                      Batal
                    </button>
                    <button type="submit" className="w-1/2 rounded-full font-bold py-2 text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900">
                      Edit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showLogoutModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-8">
                <div className="flex gap-6">
                  <div className="mb-2">
                    <h2 className="text-xl text-teal-700 font-bold mb-1">Konfirmasi Logout</h2>
                    <p className="text-sm text-teal-600 mb-4">Apakah Anda yakin ingin keluar?</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="w-1/2 py-2 font-bold border border-teal-700  text-teal-700 rounded-full hover:bg-slate-200 active:bg-slate-300" onClick={cancelLogout}>
                    Batal
                  </button>
                  <button className="w-1/2 py-2 font-bold bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-full" onClick={confirmLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="py-4">
            <div className="table-section overflow-auto border rounded-md border-slate-400">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-lg border border-slate-300">
                    <th className="px-3 lg:px-1 py-3">No</th>
                    <th className="px-8 py-3">Perusahaan</th>
                    <th className="px-8 py-3">Email</th>
                    <th className="px-8 py-3">Alamat</th>
                    <th className="px-8 py-3">Telepon</th>
                    <th className="px-8 py-3">Status</th>
                    <th className="px-8 md:py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        <ClipLoader color="rgb(15 118 110)" />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="text-center bg-red-200 text-red-800 p-4">
                        Error: {error}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((company, index) => (
                      <tr
                        key={company._id}
                        className={
                          index % 2 === 0
                            ? 'border border-slate-300 bg-slate-50 text-center text-lg font-semibold text-slate-700 break-all'
                            : 'border border-slate-300 bg-white text-center text-lg font-semibold text-slate-700 break-all'
                        }
                      >
                        <td className="px-3 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-3 py-4">{capitalizeFirstLetter(company.nama)}</td>
                        <td className="px-3 py-4">{company.email}</td>
                        <td className="px-3 py-4">
                          <h5 onMouseEnter={() => setHoveredCompanyAddress(company.alamat)} onMouseLeave={handleMouseLeave}>
                            {capitalizeFirstLetter(company.alamat.length > 28 ? `${company.alamat.slice(0, 28)}...` : company.alamat)}
                          </h5>
                        </td>
                        <td className="px-3 py-4">{company.no_telp}</td>
                        <td className="px-3 py-4">
                          <span
                            className={`hidden md:inline-flex items-center px-2 py-1 text-xs font-bold leading-none ${
                              company.status ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'
                            } rounded-full`}
                          >
                            <MdCircle className={`mr-1 ${company.status ? 'text-green-500' : 'text-red-500'}`} />
                            {company.status ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                          <span className="md:hidden">
                            {company.status ? (
                              <h2 className="flex justify-center">
                                <MdCircle className="w-3 h-3 text-green-500"></MdCircle>
                              </h2>
                            ) : (
                              <h2 className="flex justify-center">
                                <MdCircle className="w-3 h-3 text-red-500"></MdCircle>
                              </h2>
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-4 flex justify-center items-center gap-2">
                          <div className="w-8 h-8 md:w-10 md:h-10">
                            <button
                              onClick={() => handleFormEditStatus(company)}
                              className="w-full h-full bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white flex justify-center items-center font-bold rounded-full"
                            >
                              <TbEdit />
                            </button>
                          </div>
                          <div className="w-8 h-8 md:w-10 md:h-10">
                            <button
                              onClick={() => handleDeleteCompany(company)}
                              className="w-full h-full border border-teal-700 text-teal-700 hover:bg-slate-200 active:bg-slate-300 flex justify-center items-center font-bold rounded-full"
                            >
                              <TbTrash />
                            </button>
                          </div>
                          <div className="w-4">
                            <input type="checkbox" checked={selectedCompanies.includes(company.guid_company)} onChange={() => handleSelectCompany(company.guid_company)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-slate-200 bg-white px-1 py-2">
              <div>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === 1 ? 'bg-slate-300' : 'bg-white hover:bg-slate-100'} ring-1 ring-inset ring-slate-300`}
                >
                  Sebelumnya
                </button>
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => setCurrentPage(pageIndex + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      pageIndex + 1 === currentPage ? 'bg-teal-700 text-white' : 'bg-white hover:bg-slate-100'
                    } ring-1 ring-inset ring-slate-300`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === totalPages ? 'bg-slate-300' : 'bg-white hover:bg-slate-100'
                  } ring-1 ring-inset ring-slate-300`}
                >
                  Selanjutnya
                </button>
              </div>
              <div>
                <label className="mr-1 font-semibold text-sm">Item per halaman:</label>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-1 border border-slate-400 text-sm rounded-xl focus:ring-teal-700 focus:border-teal-700">
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataCompany;
