import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Presentation, FileText, Zap, Layers } from 'lucide-react';
import kadoshLogo from '../assets/kadoshAI.png';
import BackgroundMusic from './BackgroundMusic';
import themeMusic from '../assets/trainer-theme.mp3';

interface LandingPageProps {
  onStart: () => void;
  onBrowseTemplates: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseTemplates }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <BackgroundMusic src={themeMusic} />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Layers className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">TrainerKit GenAI</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onBrowseTemplates}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                Templates
              </button>
              <button
                onClick={onStart}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Start Generating
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ... rest of your landing page content ... */}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Links - Updated to use navigate */}
            <div className="flex space-x-6 text-sm text-gray-600">
              <button 
                onClick={() => navigate('/privacy')}
                className="hover:text-indigo-600 font-medium transition-colors"
              >
                Privacy Policy
              </button>
            </div>

            {/* Powered By Section */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Powered by</p>
              <img
                src={kadoshLogo}
                alt="Kadosh AI"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} TrainerKit GenAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};