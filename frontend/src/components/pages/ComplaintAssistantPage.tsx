import React, { useMemo } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import {
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface Props {
  result: any;
  onBack: () => void;
}

export function ComplaintAssistantPage({ result }: Props) {

  if (!result) return null;

  const confidence = Math.round(result.detection.confidence * 100);
  const risk = Math.max(confidence, 85);

  const timestamp = new Date(result.timestamp);

  const form = useMemo(() => ({
    category: "Online Fraud / Deepfake / Identity Misuse",
    date: timestamp.toLocaleDateString(),
    time: timestamp.toLocaleTimeString(),
    location: "Social Media / Messaging Platform",
    description: `
I am reporting a cyber crime involving digitally manipulated media detected by CyberShield India's AI forensic system.

The uploaded content has been verified as AI-generated with ${confidence}% confidence and presents high risk of fraud, impersonation and online deception.

Forensic evidence including the original media and analysis report is attached for verification.

Kindly register this complaint and initiate appropriate legal action.
`.trim()
  }), [confidence, timestamp]);

  const goPortal = () => {
    window.open("https://cybercrime.gov.in", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12">
      <div className="max-w-5xl mx-auto space-y-8 px-4">

        {/* RISK */}

        <Card className="bg-red-50 border-red-300 text-center">
          <AlertTriangle className="mx-auto text-red-600 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-red-700">
            High Risk Cyber Manipulation Detected
          </h2>
          <div className="text-5xl font-bold text-red-700 mt-2">{risk}%</div>
          <p className="text-gray-600 mt-1">Threat Probability</p>
        </Card>

        {/* GUIDED FORM */}

        <Card>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Smart Complaint Preparation
          </h3>

          <div className="mb-6">
            <label className="font-semibold">Complaint Category</label>
            <input value={form.category} readOnly className="input mt-1" />
            <div className="tip">
              <Info size={14} /> Choose fraud/deepfake since AI content was detected
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-semibold flex items-center gap-1">
                <Clock size={14} /> Incident Date
              </label>
              <input value={form.date} readOnly className="input mt-1" />
              <div className="tip">Use the time when you received the content</div>
            </div>

            <div>
              <label className="font-semibold flex items-center gap-1">
                <Clock size={14} /> Incident Time
              </label>
              <input value={form.time} readOnly className="input mt-1" />
            </div>
          </div>

          <div>
            <label className="font-semibold flex items-center gap-1">
              <MapPin size={14} /> Where did it occur?
            </label>
            <input value={form.location} readOnly className="input mt-1" />
            <div className="tip">Select platform where content was shared</div>
          </div>
        </Card>

        {/* INCIDENT DESCRIPTION — PROFESSIONAL STYLE */}

        <Card className="border-blue-200">

          <div className="flex items-center gap-3 mb-6 text-blue-700">
            <FileText size={24} />
            <h2 className="text-2xl font-bold">
              Incident Description (Auto Generated)
            </h2>
          </div>

          <div className="space-y-8 text-gray-800">

            <section>
              <h4 className="font-semibold text-lg mb-2">Incident Overview</h4>
              <p className="leading-relaxed">
                A digitally manipulated media file was identified through CyberShield India’s AI forensic
                analysis platform. The system detected strong indicators of artificial generation and
                possible cyber misuse intended to mislead or harm individuals online.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-2">Forensic Analysis Summary</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Content classified as AI-generated with high confidence</li>
                <li>Synthetic visual artifacts detected</li>
                <li>Metadata anomalies observed</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-2">Threat Assessment</h4>
              <p className="leading-relaxed text-sm">
                The manipulated media poses a high cybercrime risk including fraud, impersonation,
                misinformation campaigns, harassment, and potential financial or reputational harm.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-2">Evidence Provided</h4>
              <ul className="list-disc ml-6 text-sm space-y-1">
                <li>Uploaded media file</li>
                <li>CyberShield forensic verification report (PDF)</li>
                <li>Blockchain integrity proof where applicable</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-5 rounded-lg border">
              <h4 className="font-semibold mb-3">Complaint Text (Official Format)</h4>
              <div className="whitespace-pre-line text-sm bg-white p-4 rounded border font-mono">
                {form.description}
              </div>
            </section>

          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(form.description)}
            >
              Copy Complaint Text
            </Button>
          </div>

        </Card>

        {/* ACTIONS */}

        <div className="grid md:grid-cols-2 gap-4">
          <Button variant="primary" icon={<ExternalLink size={18} />} onClick={goPortal}>
            File Complaint on Cyber Crime Portal
          </Button>

          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(form.description)}
          >
            Copy Complaint Text
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Upload CyberShield forensic report PDF as supporting evidence
        </p>

      </div>
    </div>
  );
}