import React, { useState } from 'react';

import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

import { LandingPage } from './components/pages/LandingPage';
import { UploadPage } from './components/pages/UploadPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ReportPage } from './components/pages/ReportPage';
import { VerifyPage } from './components/pages/VerifyPage';
import { FootprintPage } from './components/pages/footprint/FootprintPage';
import { ComplaintAssistantPage } from './components/pages/ComplaintAssistantPage';

import { motion, AnimatePresence } from 'motion/react';

import { analyzeMedia } from './lib/api';

export default function App() {

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  /* ================= NAVIGATION ================= */

  const handleNavigate = (page: string, caseId?: string) => {

    if (page === 'footprint') {
      setActiveCaseId(caseId || analysisResult?.case_id || null);
      setCurrentPage('footprint');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'complaint') {
      setCurrentPage('complaint');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ================= BACKEND ANALYSIS ================= */

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeMedia(file);
      setAnalysisResult(result);
      setCurrentPage('results');
    } catch (err) {
      console.error("Backend error:", err);
      setError("Analysis failed. Backend not responding.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ================= LOADING SCREEN ================= */

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <div className="text-center text-white">

          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-8 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
          </motion.div>

          <h2 className="text-3xl font-bold mb-3">
            Analyzing Evidence...
          </h2>

          <p className="text-white/80">
            AI detection + blockchain verification running
          </p>
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */

  return (
    <div className="min-h-screen flex flex-col">

      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {error && (
        <div className="bg-red-100 text-red-700 text-center py-3 font-semibold">
          {error}
        </div>
      )}

      <main className="flex-1">

        <AnimatePresence mode="wait">

          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >

            {currentPage === 'home' && (
              <LandingPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'upload' && (
              <UploadPage onAnalyze={handleAnalyze} />
            )}

            {currentPage === 'results' && analysisResult && (
              <ResultsPage
                result={analysisResult}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'footprint' && (
              <FootprintPage
                caseId={activeCaseId}
                onBack={() => handleNavigate('results')}
              />
            )}

            {currentPage === 'complaint' && analysisResult && (
              <ComplaintAssistantPage
                result={analysisResult}
                onBack={() => handleNavigate('results')}
              />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'reports' && (
              <ReportPage />
            )}

            {currentPage === 'verify' && (
              <VerifyPage />
            )}

          </motion.div>

        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}