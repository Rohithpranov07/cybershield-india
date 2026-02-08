import React from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Shield, Brain, FileText, Lock, TrendingUp, Clock, CheckCircle, Upload, Scan, FileCheck, Network, AlertTriangle, Timer, Scale, Play, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { RotatingEmblem } from '../RotatingEmblem';
import heroImage from 'figma:asset/f1d55bdd1b732981cce7aac5082bafdf2a1dcdea.png';
import emblemOfIndia from 'figma:asset/c676f7b079899a84b0511549e8ec56744952e077.png';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2">
                <Shield className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">An officially authenticated platform integrated with authorized government systems</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                  JUSTICE BEGINS WITH PROOF
                </span>
              </h1>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Unmasking Digital Deception with AI-powered Forensics
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                India's First Blockchain-Verified Evidence Platform for Cyber Investigations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  variant="primary" 
                  className="text-base px-8 py-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onNavigate('upload')}
                >
                  Start Investigation
                </Button>
              </div>
            </motion.div>

            {/* Right Side - Rotating Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-center"
            >
              <motion.img 
                src={emblemOfIndia} 
                alt="National Emblem of India" 
                className="w-96 h-96 lg:w-[500px] lg:h-[500px] object-contain"
                animate={{ rotateY: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Investigation Workflow
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Upload",
                description: "Upload suspicious media",
              },
              {
                step: "2",
                icon: Brain,
                title: "AI Detection",
                description: "AI analyzes authenticity",
              },
              {
                step: "3",
                icon: FileText,
                title: "Forensic Report",
                description: "Generate investigation report",
              },
              {
                step: "4",
                icon: Lock,
                title: "Blockchain Proof",
                description: "Immutable evidence record",
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                    <item.icon className="text-white" size={40} />
                  </div>
                  <div className="text-sm font-bold text-gray-500 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Why CyberShield ?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to detect, analyze, and verify digital evidence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <Card hover className="h-full">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Brain size={18} />
                  AI-Powered
                </div>
                <h3 className="text-2xl font-bold mb-4">Industry-Leading<br />AI Detection</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Identifies deepfakes and AI-generated content with advanced neural networks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>85%+ accuracy with confidence scoring for investigative clarity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Supports images, videos, and multimedia evidence analysis</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Card hover className="h-full">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <FileText size={18} />
                  Ready Evidence
                </div>
                <h3 className="text-2xl font-bold mb-4">Automated Forensic Reports</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Professional forensic report generation in seconds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Complete metadata and hash analysis for evidence integrity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Downloadable PDF with case details and legal formatting</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card hover className="h-full">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Lock size={18} />
                  Tamper-Proof
                </div>
                <h3 className="text-2xl font-bold mb-4">Blockchain Verification</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Immutable blockchain anchoring ensures evidence integrity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Cryptographic proof of authenticity for legal proceedings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span>Public verification on Polygon network for transparency</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Dashboard Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 py-20">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-blue-900">
              Trusted by Investigators Nationwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { number: "1,247", label: "Cases Analyzed" },
              { number: "87%", label: "Average Detection Accuracy" },
              { number: "100%", label: "Evidence Integrity Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-8 text-center h-full flex flex-col justify-center items-center min-h-[180px] hover:bg-white/40 transition-all duration-300">
                  <div className="text-5xl lg:text-6xl font-bold mb-3 text-blue-700">{stat.number}</div>
                  <div className="text-base font-medium text-blue-800">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Verify the evidence and generate the report
            </h2>
            <div className="pt-4 flex justify-center">
              <Button 
                variant="primary" 
                className="text-lg px-12 py-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => onNavigate('upload')}
              >
                Upload Proof
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}