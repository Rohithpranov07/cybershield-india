import { useState } from 'react'
import axios from 'axios'
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Loader,
  FileText,
  Shield
} from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
      setError(null)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setResult(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(
        'http://localhost:8000/api/detect/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const downloadReport = () => {
    if (!result?.case_id) return
    window.open(
      `http://localhost:8000/api/detect/report/${result.case_id}`,
      '_blank'
    )
  }

  // Normalize detection (works for duplicate + fresh)
  const detection = result?.detection || {
    is_ai_generated: result?.is_ai_generated,
    confidence: result?.confidence
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <header className="bg-white shadow p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={40}/>
          <div>
            <h1 className="text-3xl font-bold">CyberShield India</h1>
            <p className="text-gray-600 text-sm">AI Forensic Detection</p>
          </div>
        </div>

        <a
          href="/cases"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Cases
        </a>
      </header>

      <main className="max-w-4xl mx-auto p-10">

        {/* Upload Box */}
        <div
          className={`bg-white p-12 rounded-xl shadow border-2 border-dashed text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={60} className="mx-auto text-gray-400 mb-4"/>

          {!file ? (
            <>
              <p className="text-lg mb-2">Drag & drop file here</p>
              <label className="bg-blue-600 text-white px-6 py-3 rounded cursor-pointer">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-3">
                <FileText />
                <span>{file.name}</span>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin"/> Analyzing...
                  </span>
                ) : (
                  'Analyze Now'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mt-6 flex items-center gap-2">
            <AlertCircle /> {error}
          </div>
        )}

        {/* Results */}
        {result && detection && (
          <div className="bg-white p-8 rounded-xl shadow mt-8 space-y-6">

            <div className={`p-6 rounded text-center ${
              detection.is_ai_generated
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              <h2 className="text-2xl font-bold">
                {detection.is_ai_generated ? 'AI GENERATED' : 'AUTHENTIC'}
              </h2>
              <p className="text-lg">
                Confidence: {(detection.confidence * 100).toFixed(1)}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><b>Case ID:</b> {result.case_id}</div>
              <div><b>File:</b> {result.filename}</div>
              <div><b>Type:</b> {result.media_type}</div>
              <div><b>Time:</b> {new Date(result.timestamp).toLocaleString()}</div>
            </div>

            <button
              onClick={downloadReport}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full"
            >
              📄 Download Forensic Report
            </button>

          </div>
        )}

      </main>
    </div>
  )
}