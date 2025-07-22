import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 shadow-lg backdrop-blur-md bg-opacity-80 rounded-b-xl">
      <motion.h1
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        MediaFlow
      </motion.h1>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow hover:shadow-lg transition-all text-sm font-medium"
            >
              <FaTachometerAlt />
              Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all text-sm font-medium"
            >
              <FaSignOutAlt />
              Logout
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow hover:shadow-lg transition-all text-sm font-medium"
          >
            <FaSignInAlt />
            Login
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;