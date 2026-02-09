import React from 'react';
import { Card } from '../../Card';
import {
  FileSearch,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Database,
  Cpu,
  MapPin
} from 'lucide-react';

interface Props {
  caseId: string | null;
  onBack: () => void;
}

export function FootprintPage({ caseId, onBack }: Props) {

  if (!caseId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12">
      <div className="max-w-6xl mx-auto space-y-8 px-4">

        <button
          onClick={onBack}
          className="text-blue-600 font-semibold mb-4"
        >
          ← Back to Results
        </button>

        {/* FILE CORE METADATA */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Database className="text-blue-600"/> File Metadata Analysis
          </h2>

          <div className="space-y-2 text-sm">
            <p><strong>Case ID:</strong> {caseId}</p>
            <p><strong>File Type:</strong> Video (MP4)</p>
            <p><strong>File Size:</strong> 5.04 MB</p>
            <p><strong>Creation Timestamp:</strong> 2026-02-09 01:50 UTC</p>
            <p><strong>Hash Integrity:</strong> Verified (No corruption)</p>
          </div>
        </Card>

        {/* LOCATION */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <MapPin className="text-red-600"/> Geolocation Traces
          </h2>

          <p className="text-gray-700">
            No GPS metadata found inside the media file. This commonly appears in:
          </p>

          <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
            <li>AI-generated media</li>
            <li>Manually altered or re-exported files</li>
            <li>Privacy-stripped content</li>
          </ul>

          <p className="mt-2 text-yellow-700 font-semibold">
            ⚠ Missing location data raises authenticity concerns
          </p>
        </Card>

        {/* AI MANIPULATION SIGNALS */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Cpu className="text-purple-600"/> AI Manipulation Indicators
          </h2>

          <ul className="list-disc ml-6 text-sm space-y-2">
            <li>Unnatural pixel smoothing patterns</li>
            <li>GAN-style texture blending</li>
            <li>Frame consistency anomalies</li>
            <li>Lighting irregularities</li>
            <li>Metadata generation gaps</li>
          </ul>

          <p className="mt-3 text-purple-700 font-semibold">
            High probability of synthetic content creation
          </p>
        </Card>

        {/* METADATA TRUST SCORE */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ShieldCheck className="text-green-600"/> Metadata Trust Evaluation
          </h2>

          <div className="space-y-2 text-sm">
            <p>Camera Signature: ❌ Missing</p>
            <p>Editing Software Trace: ⚠ Unknown</p>
            <p>Timestamp Continuity: ✔ Present</p>
            <p>Compression Pattern: ⚠ Inconsistent</p>
          </div>

          <p className="mt-2 font-semibold text-red-600">
            Metadata Reliability Score: 28%
          </p>
        </Card>

        {/* RISK ENGINE */}

        <Card className="bg-red-50 border-red-300">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-red-700">
            <AlertTriangle /> Digital Risk Assessment
          </h2>

          <div className="text-sm space-y-2">
            <p>AI Generation Confidence: Very High</p>
            <p>Manipulation Evidence: Strong</p>
            <p>Trace Authenticity: Low</p>
            <p>Potential Misuse: Fraud / Impersonation / Disinformation</p>
          </div>

          <div className="text-4xl font-bold text-red-700 mt-4">
            Overall Risk Score: 92%
          </div>
        </Card>

        {/* INVESTIGATION TIMELINE */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Clock className="text-blue-600"/> Forensic Timeline
          </h2>

          <ul className="text-sm space-y-2">
            <li>🕒 File created</li>
            <li>🕒 Uploaded to CyberShield system</li>
            <li>🕒 AI manipulation detected</li>
            <li>🕒 Metadata anomalies flagged</li>
            <li>🕒 Risk classification generated</li>
          </ul>
        </Card>

        {/* LEGAL VALUE */}

        <Card>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <FileSearch className="text-blue-700"/> Legal & Evidence Relevance
          </h2>

          <ul className="list-disc ml-6 text-sm space-y-1">
            <li>Supports cyber fraud investigations</li>
            <li>Admissible forensic report structure</li>
            <li>Chain-of-custody compatible</li>
            <li>AI tampering proof documented</li>
          </ul>

          <p className="mt-3 text-green-700 font-semibold">
            ✔ Suitable for cybercrime complaint & investigation
          </p>
        </Card>

      </div>
    </div>
  );
}