import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Camera, Home, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className={`${isHomePage ? 'absolute' : 'sticky'} top-0 w-full z-50 transition-all duration-300`}>
        <div className={`${isHomePage ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white/90 backdrop-blur-md border-gray-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 group">
                <Camera className={`h-8 w-8 ${isHomePage ? 'text-white group-hover:text-blue-200' : 'text-blue-600 group-hover:text-blue-700'} transition-colors`} />
                <span className={`text-xl font-bold ${isHomePage ? 'text-white group-hover:text-blue-200' : 'text-gray-900 group-hover:text-blue-700'} transition-colors`}>
                  VisionAI
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4"
                  >
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === '/dashboard'
                          ? `${isHomePage ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`
                          : `${isHomePage ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === '/profile'
                          ? `${isHomePage ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`
                          : `${isHomePage ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user?.username}</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isHomePage 
                          ? 'text-red-200 hover:text-red-100 hover:bg-red-500/20' 
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4"
                  >
                    <Link
                      to="/login"
                      className={`font-medium transition-colors ${
                        isHomePage 
                          ? 'text-white/90 hover:text-white' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isHomePage 
                          ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className={isHomePage ? '' : 'pt-0'}>
        {children}
      </main>
    </div>
  );
}