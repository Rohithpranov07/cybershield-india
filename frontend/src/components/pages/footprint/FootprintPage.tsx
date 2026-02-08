import React, { useEffect, useState } from 'react';
import { fetchFootprint } from '../../../lib/api';
import { FootprintViewer } from '../../FootprintViewer';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Props {
  caseId: string;
  onBack: () => void;
}

export function FootprintPage({ caseId, onBack }: Props) {
  const [footprint, setFootprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFootprint();
  }, [caseId]);

  const loadFootprint = async () => {
    try {
      const data = await fetchFootprint(caseId);
      setFootprint(data);
    } catch {
      setError("Failed to load digital footprint");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-20">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">

      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 font-semibold"
      >
        <ArrowLeft size={18} /> Back to Results
      </button>

      <FootprintViewer
        caseId={caseId}
        footprint={footprint}
      />
    </div>
  );
}