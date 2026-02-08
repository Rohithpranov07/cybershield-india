import React from 'react';
import { Shield } from 'lucide-react';
import azadiLogo from 'figma:asset/c32fc047b2d91fc6169a9ae888fbe5e3bbdb7d44.png';
import i4cLogo from 'figma:asset/89359ffbfa6429f7ae530d2a4edace544cc6990c.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Logo & Azadi Badge */}
        <div className="flex justify-between items-start mb-8">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <div className="font-bold text-white text-lg">CyberShield India</div>
            </div>
            <p className="text-sm text-gray-400">
              Empowering Digital Justice through AI-powered forensics and blockchain verification
            </p>
          </div>

          {/* Government Logos */}
          <div className="flex items-center gap-6">
            {/* Indian Cyber Crime Coordination Centre Logo */}
            <img 
              src={i4cLogo} 
              alt="Indian Cyber Crime Coordination Centre" 
              className="h-20 w-auto object-contain"
            />
            {/* Azadi Ka Amrit Mahotsav Logo */}
            <img 
              src={azadiLogo} 
              alt="Azadi Ka Amrit Mahotsav" 
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 CyberShield India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}