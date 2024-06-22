import React, { useState } from 'react';
import image from '../assets/3.png';

const Attendance = () => {

  return (
    <div className="min-h-screen flex justify-center items-center max-w-full mx-auto px-4 sm:px-0 bg-teal-500">
      <div className="bg-white border border-slate-400 rounded-lg px-8 pt-4 md:pt-8 pb-6 mx-auto w-full sm:w-[600px] md:w-[700px] lg:w-[800px] shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6">
          <div className="flex justify-center items-center md:col-span-1 col-span-2 mb-1">
            <img src={image} alt="logo" className="w-32 sm:w[150px] md:w-full" />
          </div>
          <div className="md:col-span-1 col-span-2">
            <div className="mb-4 md:mb-7 text-center">
              <h2 className="text-3xl text-teal-700 font-bold">Buat Kehadiran</h2>
            </div>
            <form className="w-full">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-400 appearance-none focus:outline-none focus:ring-0 focus:border-teal-700 peer"
                  required
                />
                <label
                  htmlFor="nama"
                  className="peer-focus:font-medium absolute text-sm text-slate-600 duration-200 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-teal-700"
                >
                  Nama
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-400 appearance-none focus:outline-none focus:ring-0 focus:border-teal-700 peer"
                  required
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm text-slate-500 duration-200 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-teal-700"
                >
                  Email
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="telepon"
                  id="telepon"
                  className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-400 appearance-none focus:outline-none focus:ring-0 focus:border-teal-700 peer"
                  required
                />
                <label
                  htmlFor="telepon"
                  className="peer-focus:font-medium absolute text-sm text-slate-500 duration-200 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-teal-700"
                >
                  Telepon
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 focus:ring-4 focus:outline-none focus:ring-teal-400 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center"
                >
                  Hadir
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
