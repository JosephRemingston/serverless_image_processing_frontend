import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Mail, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export default function ConfirmSignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, email } = location.state || {};

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render the form if user is authenticated
  if (isAuthenticated) {
    return null;
  }
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!username || !email) {
      navigate('/signup');
    }
  }, [username, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiService.confirmSignup(username, code);
      
      if (response.statusCode === 200) {
        setSuccess(true);
        showSuccess('Account Confirmed!', 'Your account has been successfully verified');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Confirmation failed');
        showError('Confirmation Failed', response.message || 'Failed to confirm account');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during confirmation');
      showError('Confirmation Error', error.message || 'An error occurred during confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // In a real implementation, you would call a resend confirmation code API
      setError('');
      // For now, just show a message
      setError('Resend functionality not implemented in this demo');
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Confirmed!</h2>
            <p className="text-gray-600">
              Your account has been successfully verified. Redirecting to login...
            </p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-8">
              <Camera className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                VisionAI
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-gray-600 mb-4">
              We sent a confirmation code to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <div className="flex items-center justify-center space-x-2 bg-blue-50 rounded-lg p-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 text-sm">Check your email for the 6-digit code</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmation Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code from your email</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Verify Account</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={handleResendCode}
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-500 transition-colors mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Resend Code</span>
              </button>
              
              <p className="text-gray-600">
                Need to change email?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Go back to signup
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 19,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative h-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center text-white"
          >
            <Mail className="h-20 w-20 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-6">
              Check Your Email
            </h2>
            <p className="text-xl opacity-90 max-w-md mx-auto">
              We've sent you a secure code to verify your email address and activate your account.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}