import React from 'react';

export function FootprintViewer({ footprint }: { footprint: any }) {

  if (!footprint) return null;

  const metadata = footprint.metadata || {};
  const exif = metadata.exif_data || {};
  const fileInfo = metadata.file_info || {};
  const network = footprint.network_indicators || {};

  return (
    <div className="space-y-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4">📁 File Metadata</h3>

        <p><b>Name:</b> {fileInfo.filename}</p>
        <p><b>Size:</b> {fileInfo.size_mb} MB</p>
        <p><b>Created:</b> {fileInfo.created || "Unknown"}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4">📍 Location</h3>

        {exif.gps ? (
          <>
            <p className="font-mono">{exif.gps.coordinates}</p>
            <a
              href={exif.gps.maps_url}
              target="_blank"
              className="text-blue-600 underline"
            >
              View on Maps
            </a>
          </>
        ) : (
          <p className="text-gray-500">No GPS data found</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4">🧠 Risk Analysis</h3>

        <p>Risk Score: <b>{network.risk_score || 0}</b></p>

        {network.behavioral_patterns?.map((p: string, i: number) => (
          <p key={i}>⚠️ {p}</p>
        ))}
      </div>

    </div>
  );
}
