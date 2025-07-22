import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmUser } from '../api/auth.js';
import { motion } from 'framer-motion';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await confirmUser({ username, code });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">Verify OTP</h2>

        {error && <p className="mb-4 text-center text-red-500 text-sm">{error}</p>}

        <p className="text-sm text-gray-500 mb-4 text-center">An OTP was sent to {username}</p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-6"
          placeholder="Enter your OTP code"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Confirm
        </button>
      </motion.form>
    </div>
  );
};

export default VerifyOtpPage;
