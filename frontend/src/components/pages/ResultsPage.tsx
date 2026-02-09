import React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ConfidenceMeter } from '../ConfidenceMeter';

import {
  AlertTriangle,
  CheckCircle,
  Download,
  ExternalLink,
  Share2,
  Plus,
  Lock,
  Clock,
  Eye
} from 'lucide-react';

import { motion } from 'motion/react';

interface ResultsPageProps {
  result: any;
  onNavigate: (page: string, caseId?: string) => void;
}

export function ResultsPage({ result, onNavigate }: ResultsPageProps) {

  if (!result) return null;

  const aiGenerated = result.detection?.is_ai_generated || false;

  const confidence = result?.detection?.confidence
    ? Math.round(result.detection.confidence * 100)
    : 0;

  const caseId = result.case_id;
  const fileName = result.filename;
  const timestamp = new Date(result.timestamp).toLocaleString();
  const blockchainTx = result.blockchain_tx;

  /* ================= DOWNLOAD PDF ================= */

  const downloadReport = () => {
    window.open(
      `http://localhost:8000/api/detect/report/${caseId}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">

            <Badge variant="verified" className="monospace text-sm">
              {caseId}
            </Badge>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span className="text-sm">{timestamp}</span>
            </div>

          </div>

          <h1 className="text-3xl lg:text-4xl font-bold">
            Analysis Results
          </h1>

          <p className="text-gray-600 mt-2">
            {fileName}
          </p>
        </motion.div>

        {/* ================= MAIN VERDICT ================= */}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card
            className={`relative overflow-hidden ${
              aiGenerated
                ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'
                : 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600'
            } text-white`}
          >

            <div className="grid lg:grid-cols-2 gap-8 items-center">

              <div className="text-center lg:text-left">

                <div className="inline-flex w-20 h-20 rounded-full bg-white/20 mb-6 items-center justify-center">
                  {aiGenerated ? (
                    <AlertTriangle size={40} />
                  ) : (
                    <CheckCircle size={40} />
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  {aiGenerated
                    ? 'AI-GENERATED CONTENT DETECTED'
                    : 'AUTHENTIC CONTENT VERIFIED'}
                </h2>

                <p className="text-xl text-white/90">
                  {aiGenerated
                    ? 'High probability this media is artificially created'
                    : 'High probability this media is genuine'}
                </p>

              </div>

              <div className="flex justify-center">
                <div className="text-center">

                  <ConfidenceMeter value={confidence} size="large" />

                  <div className="mt-4 text-sm uppercase tracking-wider">
                    Confidence Score — {confidence}%
                  </div>

                </div>
              </div>

            </div>

          </Card>
        </motion.div>

        {/* ================= BLOCKCHAIN PROOF ================= */}

        <Card className="mb-8">

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lock className="text-blue-600" />
            Blockchain Evidence
          </h3>

          {blockchainTx ? (

            <div className="bg-purple-50 p-4 rounded border">

              <p className="text-sm text-gray-600 mb-1">
                Transaction Hash
              </p>

              <a
                href={`https://sepolia.etherscan.io/tx/${blockchainTx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-purple-700 underline break-all"
              >
                {blockchainTx}
              </a>

              <div className="flex items-center gap-2 text-green-600 mt-2">
                <CheckCircle size={16} />
                Evidence secured on blockchain
              </div>

            </div>

          ) : (

            <div className="text-yellow-600 font-medium">
              ⏳ Blockchain anchoring pending (needs gas)
            </div>

          )}

        </Card>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

          <Button
            variant="primary"
            icon={<Download size={20} />}
            onClick={downloadReport}
          >
            Download Report
          </Button>

          {blockchainTx && (
            <Button
              variant="secondary"
              icon={<ExternalLink size={20} />}
              className="gradient-primary text-white border-0"
              onClick={() =>
                window.open(
                  `https://sepolia.etherscan.io/tx/${blockchainTx}`,
                  '_blank'
                )
              }
            >
              View Blockchain
            </Button>
          )}

          <Button
            variant="outline"
            icon={<Eye size={20} />}
            onClick={() => onNavigate('footprint', caseId)}
          >
            Digital Footprint
          </Button>

          <Button variant="outline" icon={<Share2 size={20} />}>
            Share Case
          </Button>

          <Button
            variant="outline"
            icon={<Plus size={20} />}
            onClick={() => onNavigate('upload')}
          >
            New Analysis
          </Button>

          {/* 🚨 COMPLAINT ASSISTANT BUTTON */}

          {aiGenerated && (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-0 col-span-2 lg:col-span-1"
              onClick={() => onNavigate('complaint')}
            >
              🚨 File Cyber Crime Complaint
            </Button>
          )}

        </div>

      </div>
    </div>
  );
}