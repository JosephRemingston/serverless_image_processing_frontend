import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { generateSignedUrl, uploadToS3 } from '../api/media.js';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'image/png') {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage('');
    } else {
      setMessage('Please select a PNG image only.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    if (file.type !== 'image/png') {
      setMessage('Only PNG files are allowed.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const { signedUrl, key } = await generateSignedUrl(token);
      await uploadToS3(signedUrl, file);

      setMessage(`✅ Image uploaded successfully! (S3 Key: ${key})`);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage(err.message || '❌ Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#f7f8fa] via-[#eef1f5] to-[#f7f8fa] text-gray-800">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Hello, {user?.username}</h2>
          <p className="text-gray-500 text-sm md:text-base">Email: {user?.email}</p>
        </motion.div>

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Upload PNG Image</h3>

          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="w-full mb-4 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />

          {preview && (
            <div className="mb-4 flex justify-center">
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-xl shadow-md border" />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload to S3'}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm ${message.startsWith('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;