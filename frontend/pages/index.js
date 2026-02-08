import { useState } from 'react'
import axios from 'axios'
import {
  Upload,
  AlertCircle,
  Loader,
  FileText,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(
        'http://localhost:8000/api/detect/analyze',
        formData
      )
      setResult(res.data)
    } catch {
      setError("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const downloadReport = () => {
    window.open(
      `http://localhost:8000/api/detect/report/${result.case_id}`,
      '_blank'
    )
  }

  const detection = result?.detection || result

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <header className="bg-white shadow p-6 flex justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={40}/>
          <div>
            <h1 className="text-3xl font-bold">CyberShield India</h1>
            <p className="text-gray-600 text-sm">AI + Blockchain Forensics</p>
          </div>
        </div>

        <a href="/cases" className="bg-blue-600 text-white px-4 py-2 rounded">
          View Cases
        </a>
      </header>

      <main className="max-w-4xl mx-auto p-10">

        <div
          className={`bg-white p-12 rounded-xl shadow border-2 border-dashed text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <Upload size={60} className="mx-auto text-gray-400 mb-4"/>

          {!file ? (
            <>
              <p className="text-lg mb-2">Drag & drop file</p>
              <input type="file" onChange={e => setFile(e.target.files[0])}/>
            </>
          ) : (
            <>
              <p>{file.name}</p>
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
              >
                {uploading ? "Analyzing..." : "Analyze Now"}
              </button>
            </>
          )}
        </div>

        {result && (
          <div className="bg-white p-8 rounded-xl shadow mt-8 space-y-6">

            <div className={`p-6 rounded text-center ${
              detection.is_ai_generated ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <h2 className="text-2xl font-bold">
                {detection.is_ai_generated ? "AI GENERATED" : "AUTHENTIC"}
              </h2>
              <p>Confidence: {(detection.confidence * 100).toFixed(1)}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><b>Case:</b> {result.case_id}</div>
              <div><b>File:</b> {result.filename}</div>
            </div>

            {/* 🔗 Blockchain Proof */}
            {result.blockchain_tx ? (
              <div className="pt-4 border-t">
                <p className="text-sm mb-2">🔗 Blockchain Proof</p>

                <div className="bg-purple-50 p-4 rounded border">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${result.blockchain_tx}`}
                    target="_blank"
                    className="font-mono text-xs text-purple-700 underline break-all"
                  >
                    {result.blockchain_tx}
                  </a>

                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <CheckCircle size={14} className="mr-1"/> Evidence secured on blockchain
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">⏳ Blockchain pending (needs gas)</p>
            )}

            <button
              onClick={downloadReport}
              className="bg-blue-600 text-white px-6 py-3 rounded w-full"
            >
              Download Report
            </button>

          </div>
        )}

      </main>
    </div>
  )
}