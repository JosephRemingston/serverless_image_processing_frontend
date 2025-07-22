import React, { useContext, useEffect, useState } from 'react';
import { getProcessedImages } from '../api/processedImage.js';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';

const DashboardPage = () => {
  const { user, tokens } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const sanitizeEmailForApi = (email) => {
    if (!email) return "";
    return email.replace(/[@.]/g, "_");
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const sanitizedEmail = sanitizeEmailForApi(user.email);
        const data = await getProcessedImages(tokens.token, sanitizedEmail);
        setFiles(data.images);
        setSelectedFile(data.images[0] || null);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [tokens.token, user.email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white p-5 border-r border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Files</h2>
          <div className="overflow-y-auto h-full space-y-2 pr-2 custom-scrollbar">
            {files.length === 0 && !loading ? (
              <p className="text-gray-500 text-sm">No uploads yet.</p>
            ) : (
              files.map((file) => (
                <motion.div
                  key={file._id}
                  onClick={() => setSelectedFile(file)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg cursor-pointer truncate transition-all ${
                    selectedFile?._id === file._id 
                      ? 'bg-gradient-to-r from-teal-400 to-indigo-500 text-white shadow-lg'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {file.fileName.replace('.json', '')}
                </motion.div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 min-h-[80vh]"
          >
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ) : errorMsg ? (
              <div className="text-red-500 text-lg">{errorMsg}</div>
            ) : selectedFile ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFile._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-2xl font-bold text-teal-500">{selectedFile.fileName.replace('.json', '')}</div>
                  <div className="flex justify-center">
                    <img
                      src={selectedFile.processedFile}
                      alt="Processed"
                      className="max-w-full max-h-[400px] rounded-xl shadow-md object-contain border border-gray-200"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Detected Labels</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedFile.rawAiResponse.map((label, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                        >
                          <h4 className="text-lg font-semibold text-indigo-500 mb-1">{label.Name}</h4>
                          <p className="text-sm mb-1">Confidence: <span className="text-green-600">{label.Confidence.toFixed(2)}%</span></p>
                          {label.Categories?.length > 0 && (
                            <div className="text-xs text-gray-500 mb-1">
                              Category: {label.Categories.map(cat => cat.Name).join(', ')}
                            </div>
                          )}
                          {label.Aliases?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {label.Aliases.map((alias, i) => (
                                <span key={i} className="bg-gray-200 px-2 py-1 text-xs rounded-full text-gray-600">{alias.Name}</span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-gray-500 text-lg text-center">Select a file from the sidebar to view its labels and preview.</div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;