import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Zap, 
  Eye,
  Download,
  Trash2,
  FileImage,
  Loader2
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

interface ProcessingOptions {
  resize: boolean;
  width: number;
  quality: number;
  format: string;
}

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [processingResults, setProcessingResults] = useState<any>(null);
  const [conversionResults, setConversionResults] = useState<any>(null);
  const [showProcessingOptions, setShowProcessingOptions] = useState(false);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    resize: false,
    width: 1024,
    quality: 80,
    format: 'jpeg'
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size too large. Please select an image smaller than 5MB.');
        showError('File Too Large', 'Please select an image smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        showError('Invalid File Type', 'Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setAnalysisResults(null);
      setProcessingResults(null);
      setConversionResults(null);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size too large. Please select an image smaller than 5MB.');
        showError('File Too Large', 'Please select an image smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        showError('Invalid File Type', 'Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setAnalysisResults(null);
      setProcessingResults(null);
      setConversionResults(null);
      setError('');
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
          imageName: selectedFile.name
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

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await apiService.convertImageToBytesWithProcessing(
        selectedFile,
        processingOptions
      );
      
      if (response.statusCode === 200) {
        setProcessingResults(response.data);
        showSuccess('Processing Complete', 'Image processed successfully');
      } else {
        setError(response.message || 'Processing failed');
        showError('Processing Failed', response.message || 'Failed to process image');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during processing');
      showError('Processing Error', error.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError('');

    try {
      const response = await apiService.convertImageToBytes(selectedFile);
      
      if (response.statusCode === 200) {
        setConversionResults(response.data);
        showSuccess('Conversion Complete', 'Image converted to base64 successfully');
      } else {
        setError(response.message || 'Conversion failed');
        showError('Conversion Failed', response.message || 'Failed to convert image');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during conversion');
      showError('Conversion Error', error.message || 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResults(null);
    setProcessingResults(null);
    setConversionResults(null);
    setError('');
    setShowProcessingOptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <p className="text-xl text-gray-600">
            Upload an image to discover what our AI can see
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-blue-600" />
                  <span>Image Upload</span>
                </h2>
              </div>

              <div className="p-6">
                {!selectedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your image here
                    </p>
                    <p className="text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <FileImage className="h-4 w-4" />
                      <span>Supports JPG, PNG, GIF up to 5MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewUrl!}
                        alt="Selected"
                        className="w-full h-64 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5" />
                            <span>Analyze with AI</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={convertImage}
                        disabled={isConverting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        {isConverting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Converting...</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-5 w-5" />
                            <span>Convert to Bytes</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowProcessingOptions(!showProcessingOptions)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span>Process Image</span>
                      </button>
                    </div>

                    {showProcessingOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-lg p-4 space-y-4"
                      >
                        <h4 className="font-semibold text-gray-900">Processing Options</h4>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={processingOptions.resize}
                              onChange={(e) => setProcessingOptions(prev => ({
                                ...prev,
                                resize: e.target.checked
                              }))}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Resize image</span>
                          </label>

                          {processingOptions.resize && (
                            <div className="ml-6 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Width (px)</label>
                                <input
                                  type="number"
                                  value={processingOptions.width}
                                  onChange={(e) => setProcessingOptions(prev => ({
                                    ...prev,
                                    width: parseInt(e.target.value) || 1024
                                  }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  min="100"
                                  max="4000"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Quality (%)</label>
                                <input
                                  type="range"
                                  value={processingOptions.quality}
                                  onChange={(e) => setProcessingOptions(prev => ({
                                    ...prev,
                                    quality: parseInt(e.target.value)
                                  }))}
                                  className="w-full"
                                  min="10"
                                  max="100"
                                />
                                <span className="text-xs text-gray-500">{processingOptions.quality}%</span>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Format</label>
                                <select
                                  value={processingOptions.format}
                                  onChange={(e) => setProcessingOptions(prev => ({
                                    ...prev,
                                    format: e.target.value
                                  }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                  <option value="jpeg">JPEG</option>
                                  <option value="png">PNG</option>
                                  <option value="webp">WebP</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={processImage}
                          disabled={isProcessing}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Process Image</span>
                          )}
                        </button>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  max="5242880"
                />
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* AI Analysis Results */}
            {(!processingResults || analysisResults) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-green-600" />
                    <span>AI Analysis Results</span>
                  </h2>
                </div>

                <div className="p-6">
                  {!analysisResults ? (
                    <div className="text-center py-12">
                      <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl font-medium text-gray-500 mb-2">
                        No analysis yet
                      </p>
                      <p className="text-gray-400">
                        Upload an image and click "Analyze with AI" to see what our AI detects
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                          Detected <span className="font-semibold">{analysisResults.labels.length}</span> labels
                        </p>
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                      </div>

                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {analysisResults.labels
                          .sort((a, b) => b.Confidence - a.Confidence)
                          .map((label, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-lg border ${getConfidenceColor(label.Confidence)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-lg">{label.Name}</span>
                                <span className="text-sm font-medium">
                                  {label.Confidence.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-white rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                      label.Confidence >= 90 ? 'bg-green-500' :
                                      label.Confidence >= 70 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${label.Confidence}%` }}
                                  />
                                </div>
                              </div>

                              {label.Parents && label.Parents.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600 mb-1">Categories:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {label.Parents.map((parent, pIndex) => (
                                      <span
                                        key={pIndex}
                                        className="text-xs bg-white/60 px-2 py-1 rounded-full"
                                      >
                                        {parent.Name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {label.Instances && label.Instances.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600">
                                    {label.Instances.length} instance{label.Instances.length > 1 ? 's' : ''} detected
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Conversion Results */}
            {conversionResults && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6 text-green-600" />
                    <span>Conversion Results</span>
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">File Size</p>
                        <p className="font-semibold text-gray-900">
                          {(conversionResults.byteLength / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Format</p>
                        <p className="font-semibold text-gray-900">Base64</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Base64 Data (Preview)</label>
                      <textarea
                        readOnly
                        value={conversionResults.base64Data.substring(0, 200) + '...'}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        Showing first 200 characters. Full data length: {conversionResults.base64Data.length} characters
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(conversionResults.base64Data);
                        showSuccess('Copied!', 'Base64 data copied to clipboard');
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Copy Base64 Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Processing Results */}
            {processingResults && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                    <span>Processing Results</span>
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">File Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Size:</span>
                          <span className="font-medium">{(processingResults.originalByteLength / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processed Size:</span>
                          <span className="font-medium">{(processingResults.processedByteLength / 1024).toFixed(2)} KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compression:</span>
                          <span className="font-medium text-green-600">{processingResults.compressionRatio}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Processing Options</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resized:</span>
                          <span className="font-medium">{processingResults.processingOptions.resized ? 'Yes' : 'No'}</span>
                        </div>
                        {processingResults.processingOptions.resized && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Target Width:</span>
                              <span className="font-medium">{processingResults.processingOptions.targetWidth}px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality:</span>
                              <span className="font-medium">{processingResults.processingOptions.quality}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Format:</span>
                              <span className="font-medium uppercase">{processingResults.processingOptions.format}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {processingResults.originalMetadata && processingResults.processedMetadata && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Image Metadata</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Original</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dimensions:</span>
                              <span>{processingResults.originalMetadata.width} × {processingResults.originalMetadata.height}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Format:</span>
                              <span className="uppercase">{processingResults.originalMetadata.format}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Processed</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dimensions:</span>
                              <span>{processingResults.processedMetadata.width} × {processingResults.processedMetadata.height}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Format:</span>
                              <span className="uppercase">{processingResults.processedMetadata.format}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}