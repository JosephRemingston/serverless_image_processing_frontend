import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/upload');
    } else {
      navigate('/login');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#f7f8fa] via-[#eef1f5] to-[#f7f8fa] text-gray-800">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 bg-clip-text text-transparent mb-6"
        >
          Effortless Serverless Media Processing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base md:text-lg text-gray-600 mb-10 max-w-xl leading-relaxed"
        >
          Upload, process, and manage your media seamlessly with our cloud-native platform. No backend setup required—just focus on your content.
        </motion.p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-teal-400 to-indigo-500 px-8 py-3 rounded-full text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </motion.button>

          <motion.button
            onClick={handleRegister}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-semibold border border-gray-300 shadow-md hover:shadow-lg transition-all"
          >
            Register
          </motion.button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;