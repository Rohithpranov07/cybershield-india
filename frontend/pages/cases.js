import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Download, AlertCircle, CheckCircle } from 'lucide-react'

export default function Cases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get('/api/detect/cases?limit=100')
      setCases(res.data.cases)
    } catch (err) {
      console.error('Failed to load cases', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = (caseId) => {
    window.open(
      `http://localhost:8000/api/detect/report/${caseId}`,
      '_blank'
    )
  }

  const filteredCases = cases.filter(c => {
    if (filter === 'ai') return c.is_ai_generated
    if (filter === 'real') return !c.is_ai_generated
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <header className="bg-white shadow p-6 flex items-center space-x-4">
        <a href="/" className="hover:text-blue-600">
          <ArrowLeft />
        </a>
        <h1 className="text-3xl font-bold">Case History</h1>
      </header>

      <main className="max-w-6xl mx-auto p-8">

        {/* Filters */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>

          <button
            onClick={() => setFilter('ai')}
            className={`px-4 py-2 rounded ${filter === 'ai' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            AI-Generated
          </button>

          <button
            onClick={() => setFilter('real')}
            className={`px-4 py-2 rounded ${filter === 'real' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Authentic
          </button>
        </div>

        {loading ? (
          <p>Loading cases...</p>
        ) : filteredCases.length === 0 ? (
          <p className="bg-white p-6 rounded shadow">No cases found</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">PDF</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map(c => (
                  <tr key={c.case_id} className="border-t hover:bg-gray-50">

                    <td className="p-3 font-mono text-sm">
                      {c.case_id.slice(0, 18)}...
                    </td>

                    <td className="p-3">{c.filename}</td>

                    <td className="p-3 uppercase text-sm">{c.media_type}</td>

                    <td className="p-3">
                      {c.is_ai_generated ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle size={16}/> AI
                        </span>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16}/> Real
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {(c.confidence * 100).toFixed(1)}%
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => downloadPDF(c.case_id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download size={16}/> PDF
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </main>
    </div>
  )
}