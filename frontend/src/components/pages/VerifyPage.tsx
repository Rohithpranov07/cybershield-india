import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import {
  Search, CheckCircle, AlertTriangle, ExternalLink, Download,
  Lock, Hash, Clock, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaseItem {
  case_id: string;
  blockchain_tx?: string;
  confidence: number;
  is_ai_generated: boolean;
  created_at: string;
}

export function VerifyPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<CaseItem | null>(null);
  const [status, setStatus] = useState<'verified' | 'not-found' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /* ================= REAL BACKEND VERIFY ================= */

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatus(null);
    setResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/detect/cases');
      const data = await res.json();

      const found = data.cases.find(
        (c: CaseItem) =>
          c.case_id === searchQuery || c.blockchain_tx === searchQuery
      );

      if (found) {
        setResult(found);
        setStatus('verified');
      } else {
        setStatus('not-found');
      }
    } catch {
      setStatus('not-found');
    } finally {
      setIsSearching(false);
    }
  };

  /* ====================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center mb-6">
            <Lock className="text-white" size={40} />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Blockchain Evidence Verification
          </h1>

          <p className="text-xl text-gray-600">
            Verify evidence authenticity stored on blockchain
          </p>
        </motion.div>

        {/* SEARCH */}
        <Card className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Case ID or Transaction Hash"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button variant="primary" onClick={handleSearch}>
              {isSearching ? 'Verifying...' : 'Verify Evidence'}
            </Button>
          </div>
        </Card>

        {/* RESULTS */}
        <AnimatePresence mode="wait">
          {status && (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: .9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: .9 }}
            >

              {/* ================= VERIFIED ================= */}

              {status === 'verified' && result && (
                <>
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white mb-6">
                    <div className="text-center py-10">
                      <CheckCircle size={70} className="mx-auto mb-4" />
                      <h2 className="text-4xl font-bold mb-3">
                        EVIDENCE VERIFIED ✓
                      </h2>
                      <p className="text-xl">
                        Blockchain record confirmed and intact
                      </p>
                    </div>
                  </Card>

                  <Card className="mb-6">
                    <h3 className="text-xl font-bold mb-6">Evidence Details</h3>

                    <div className="grid md:grid-cols-2 gap-6">

                      <div>
                        <div className="text-sm text-gray-500">Case ID</div>
                        <div className="font-mono font-semibold">{result.case_id}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Timestamp</div>
                        <div>{new Date(result.created_at).toLocaleString()}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">AI Result</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          result.is_ai_generated
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.is_ai_generated ? 'AI-Generated' : 'Authentic'}
                        </span>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Confidence</div>
                        <div className="font-semibold">
                          {Math.round(result.confidence * 100)}%
                        </div>
                      </div>

                    </div>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <h3 className="text-xl font-bold mb-4 flex gap-2 items-center">
                      <Hash className="text-blue-600" /> Blockchain Transaction
                    </h3>

                    {result.blockchain_tx ? (
                      <div className="flex items-center gap-2">
                        <div className="monospace bg-white p-2 rounded break-all flex-1">
                          {result.blockchain_tx}
                        </div>

                        <button
                          onClick={() =>
                            window.open(
                              `https://sepolia.etherscan.io/tx/${result.blockchain_tx}`,
                              '_blank'
                            )
                          }
                          className="p-2 hover:bg-white rounded"
                        >
                          <ExternalLink className="text-blue-600" size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-yellow-700 font-semibold">
                        Blockchain anchoring pending
                      </div>
                    )}
                  </Card>
                </>
              )}

              {/* ================= NOT FOUND ================= */}

              {status === 'not-found' && (
                <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <div className="text-center py-12">
                    <AlertTriangle size={70} className="mx-auto mb-4" />
                    <h2 className="text-4xl font-bold mb-3">NO RECORD FOUND</h2>
                    <p className="text-xl">
                      This evidence does not exist in blockchain registry
                    </p>
                  </div>
                </Card>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}