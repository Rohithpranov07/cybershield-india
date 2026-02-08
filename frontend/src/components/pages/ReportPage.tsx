import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Download, Printer, Mail, Shield, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CaseItem {
  case_id: string;
  filename: string;
  media_type: string;
  confidence: number;
  is_ai_generated: boolean;
  created_at: string;
  blockchain_tx?: string;
}

export function ReportPage() {

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selected, setSelected] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD RECENT CASES ================= */

  useEffect(() => {
    fetch('http://localhost:8000/api/detect/cases')
      .then(res => res.json())
      .then(data => {
        const recent = data.cases.slice(0, 3);
        setCases(recent);
        setSelected(recent[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= EMPTY STATE ================= */

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading reports...</div>;
  }

  if (!selected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No reports yet</h2>
          <p className="text-gray-600 mb-6">Upload media to generate forensic report</p>
          <Button variant="primary">Go to Upload</Button>
        </Card>
      </div>
    );
  }

  const caseId = selected.case_id;
  const analysisDate = new Date(selected.created_at).toLocaleDateString();
  const reportDate = new Date(selected.created_at).toLocaleString();
  const confidence = Math.round(selected.confidence * 100);

  /* ================= DOWNLOAD ================= */

  const downloadPDF = () => {
    window.open(
      `http://localhost:8000/api/detect/report/${caseId}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-12">

      {/* ===== RECENT SELECTOR ===== */}
      <div className="max-w-4xl mx-auto mb-6 flex gap-3 justify-center">
        {cases.map(c => (
          <button
            key={c.case_id}
            onClick={() => setSelected(c)}
            className={`px-4 py-2 rounded-lg text-sm border transition ${
              selected.case_id === c.case_id
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-blue-50'
            }`}
          >
            {c.case_id}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* ================= REPORT DOCUMENT ================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl"
        >

          {/* LETTERHEAD */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 flex justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <Shield className="text-blue-600" size={32} />
              </div>
              <div>
                <div className="text-2xl font-bold">CyberShield India</div>
                <div className="text-sm opacity-90">AI-Powered Digital Forensics Platform</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div>Mumbai, India</div>
              <div>cybershield.gov.in</div>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* TITLE */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold">DIGITAL FORENSIC ANALYSIS REPORT</h1>
              <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded text-sm mt-2">
                CONFIDENTIAL - FOR INVESTIGATIVE USE
              </div>
            </div>

            {/* CASE INFO */}
            <div className="grid md:grid-cols-2 gap-6">

              <Card className="bg-gray-50">
                <h3 className="font-bold mb-3">Case Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Case ID:</span>
                    <span className="font-semibold">{caseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investigation Date:</span>
                    <span>{analysisDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analyst:</span>
                    <span>System AI Engine</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report Generated:</span>
                    <span>{reportDate}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-50">
                <h3 className="font-bold mb-3">Media Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Media Type:</span>
                    <span>{selected.media_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Name:</span>
                    <span>{selected.filename}</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* CONCLUSION */}
            <div className="border-l-4 border-blue-600 bg-blue-50 p-6">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-600" />
                Analysis Conclusion
              </h3>

              <div className={`text-2xl font-bold mb-2 ${
                selected.is_ai_generated ? 'text-red-700' : 'text-green-700'
              }`}>
                {selected.is_ai_generated
                  ? 'AI-GENERATED CONTENT DETECTED'
                  : 'AUTHENTIC CONTENT VERIFIED'}
              </div>

              <div className="font-semibold mb-2">
                Confidence Score: {confidence}%
              </div>

              <p className="text-gray-700">
                Automated forensic models analyzed the media using deep learning
                and metadata inspection techniques.
              </p>
            </div>

            {/* BLOCKCHAIN */}
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Lock className="text-blue-600" />
                Evidence Integrity Proof
              </h3>

              {selected.blockchain_tx ? (
                <div className="break-all text-sm">
                  <strong>Transaction Hash:</strong><br />
                  {selected.blockchain_tx}
                </div>
              ) : (
                <div className="text-yellow-700">
                  Blockchain anchoring pending
                </div>
              )}
            </div>

            {/* SIGNATURE */}
            <div className="border-t pt-6 flex justify-between">
              <div>
                <div className="text-sm text-gray-600">Digitally Signed By</div>
                <div className="font-bold">CyberShield AI System</div>
                <div className="text-sm text-gray-500">{reportDate}</div>
              </div>

              <Shield className="text-blue-600" size={48} />
            </div>

          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="primary" icon={<Download size={18} />} onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="outline" icon={<Printer size={18} />}>Print</Button>
          <Button variant="outline" icon={<Mail size={18} />}>Email</Button>
        </div>

      </div>
    </div>
  );
}