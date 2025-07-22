import React, { useState } from 'react';
import { signupUser } from '../api/auth.js';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signupUser(form);
      navigate('/verify-otp', { state: { username: form.username } });
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
        <h2 className="text-3xl mb-6 font-bold text-center text-gray-800">Create Account</h2>

        {error && <p className="mb-4 text-center text-red-500 text-sm">{error}</p>}

        {['username', 'email', 'password'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block mb-1 text-gray-600 text-sm capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder={`Enter your ${field}`}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Register
        </button>
      </motion.form>
    </div>
  );
};

export default RegisterPage;