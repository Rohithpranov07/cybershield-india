import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../Button';
import { Card } from '../Card';
import { Upload, X, CheckCircle, Loader2, FileImage, FileVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadPageProps {
  onAnalyze: (file: File) => void;
}

export function UploadPage({ onAnalyze }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // 🔥 REAL UPLOAD WITH PROGRESS
  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:8000/api/detect/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );

      setSelectedFile(file);
      setUploaded(true);

    } catch (err) {
      console.error(err);
      setError("Upload failed. Backend not reachable.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploaded(false);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile); // this triggers real AI flow in App.tsx
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upload & Analyze Evidence</h1>
          <p className="text-xl text-gray-600">
            AI-powered deepfake & forensic detection
          </p>
        </div>

        {/* Upload Zone */}
        {!selectedFile && !uploading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <form
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input
                  type="file"
                  onChange={handleChange}
                  accept="image/*,video/*"
                  className="hidden"
                  id="file-upload"
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={64} className="mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold mb-2">Drag & Drop File</h3>
                  <p className="text-gray-600">or click to browse</p>
                </label>
              </form>
            </Card>

            {error && (
              <p className="text-red-600 text-center mt-4">{error}</p>
            )}
          </motion.div>
        )}

        {/* Uploading */}
        <AnimatePresence>
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="text-center">
                <Loader2 className="mx-auto mb-4 animate-spin text-blue-500" size={64} />
                <h3 className="text-2xl font-bold mb-4">Uploading...</h3>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="h-full bg-blue-500"
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-gray-600">{uploadProgress}%</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploaded Preview */}
        <AnimatePresence>
          {selectedFile && uploaded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <div className="flex gap-6">

                  <div className="w-24 h-24 rounded-lg bg-blue-600 flex items-center justify-center">
                    {selectedFile.type.startsWith('image/') ? (
                      <FileImage className="text-white" size={40} />
                    ) : (
                      <FileVideo className="text-white" size={40} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{selectedFile.name}</h3>
                        <p className="text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button onClick={handleRemoveFile}>
                        <X />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 my-4">
                      <CheckCircle /> Upload successful
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleAnalyze} variant="primary" className="flex-1">
                        Analyze Evidence
                      </Button>
                      <Button onClick={handleRemoveFile} variant="outline">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}