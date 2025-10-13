import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Eye,
  Trash2,
  FileImage,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiService } from '../services/api';

interface DetectedLabel {
  Name: string;
  Confidence: number;
  Instances?: Array<{
    BoundingBox: {
      Width: number;
      Height: number;
      Left: number;
      Top: number;
    };
    Confidence: number;
  }>;
  Parents?: Array<{
    Name: string;
  }>;
}

interface AnalysisResult {
  labels: DetectedLabel[];
  dbId: string;
  imageName?: string;
}

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const validateAndSetFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Please select an image smaller than 5MB.');
      showError('File Too Large', 'Please select an image smaller than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      showError('Invalid File Type', 'Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    setAnalysisResults(null);
    setError('');
    setPreviewUrl(URL.createObjectURL(file));
  };

  const analyzeImage = async () => {
    if (!selectedFile || !token) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const response = await apiService.detectLabels(selectedFile, token);
      if (response.statusCode === 200) {
        setAnalysisResults({
          labels: response.data.labels,
          dbId: response.data.dbId,
          imageName: selectedFile.name,
        });
        showSuccess('Analysis Complete', `Found ${response.data.labels.length} labels in your image`);
      } else {
        setError(response.message || 'Analysis failed');
        showError('Analysis Failed', response.message || 'Failed to analyze image');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during analysis');
      showError('Analysis Error', error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResults(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-xl text-gray-600">Upload an image to discover what our AI can see</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white shadow-sm relative"
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg mb-4 object-contain" />
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    Analyze
                  </button>

                  <button
                    onClick={clearImage}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <>
                <FileImage className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-2 text-center">
                  Drag & drop an image here, or click to browse
                </p>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Choose File
                </button>
              </>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* AI Analysis Results */}
            {analysisResults && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Detected Labels ({analysisResults.labels.length})
                  </h3>
                  <p className="text-sm text-gray-500">{analysisResults.imageName}</p>
                </div>
                <div className="p-4 max-h-72 overflow-y-auto">
                  <ul className="space-y-2">
                    {analysisResults.labels.map((label, index) => (
                      <li
                        key={index}
                        className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg border ${getConfidenceColor(
                          label.Confidence
                        )}`}
                      >
                        <span>{label.Name}</span>
                        <span className="font-medium">{label.Confidence.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
