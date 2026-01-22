import React, { useEffect, useState } from 'react';
import { ArrowRight, Presentation, FileText, Zap, Layers, Sparkles } from 'lucide-react';
import kadoshLogo from '../assets/kadoshAI.png';
import BackgroundMusic from './BackgroundMusic';
import themeMusic from '../assets/trainer-theme.mp3';

interface LandingPageProps {
  onStart: () => void;
  onBrowseTemplates: () => void;
  onPrivacyPolicyClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseTemplates, onPrivacyPolicyClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col relative overflow-hidden">
      <BackgroundMusic src={themeMusic} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{
            top: '10%',
            left: '10%',
            animation: 'blob 7s infinite'
          }}
        />
        <div
          className="absolute w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{
            top: '50%',
            right: '10%',
            animation: 'blob 7s infinite 2s'
          }}
        />
        <div
          className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{
            bottom: '10%',
            left: '50%',
            animation: 'blob 7s infinite 4s'
          }}
        />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Layers className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold text-gray-900">TrainerKit GenAI</span>
              <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onBrowseTemplates}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Browse Templates
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm animate-bounce">
              AI-Powered Training Creation
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create Corporate Training,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 animate-gradient">
                In Seconds, Not Days
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Instantly generate professional slide decks, facilitator guides, participant handouts,
              and flashcards from a simple topic or document upload.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onStart}
                className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group flex items-center overflow-hidden transform hover:scale-105"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative">Start Generating Free</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform relative" />
              </button>
            </div>

            {/* Floating stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">5 min</div>
                <div className="text-sm text-gray-600">Average Generation Time</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-cyan-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Customizable Content</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">4 Formats</div>
                <div className="text-sm text-gray-600">Export Options</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 animate-float">
                <Presentation className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Instant Slide Decks</h3>
              <p className="text-gray-600 leading-relaxed">
                Get professionally structured presentations with speaker notes and AI-curated
                background imagery ready for PowerPoint.
              </p>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-cyan-100 group" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '1s' }}>
                <FileText className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">Comprehensive Guides</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate detailed Facilitator Guides with timelines and Participant Handouts
                in clean Markdown or PDF formats.
              </p>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 group" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: '2s' }}>
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Interactive Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Reinforce learning with automatically generated flashcards and role-playing
                scenarios tailored to your industry.
              </p>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-32 relative">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Four simple steps to create comprehensive training materials
            </p>
            <div className="relative grid md:grid-cols-4 gap-8">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200">
                <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 animate-pulse"></div>
              </div>

              <div className="text-center relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-125 transition-all duration-300 relative z-10">
                  <span className="group-hover:scale-110 transition-transform">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Topic</h3>
                <p className="text-gray-600">Describe your training topic or upload a document</p>
              </div>

              <div className="text-center relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-125 transition-all duration-300 relative z-10">
                  <span className="group-hover:scale-110 transition-transform">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Plan</h3>
                <p className="text-gray-600">AI generates a comprehensive training outline for your approval</p>
              </div>

              <div className="text-center relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-125 transition-all duration-300 relative z-10">
                  <span className="group-hover:scale-110 transition-transform">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Kit</h3>
                <p className="text-gray-600">Create full training materials with one click</p>
              </div>

              <div className="text-center relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-125 transition-all duration-300 relative z-10">
                  <span className="group-hover:scale-110 transition-transform">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Use</h3>
                <p className="text-gray-600">Export to PPTX, PDF, or Markdown and start training</p>
              </div>
            </div>

            {/* Call to action */}
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">TrainerKit GenAI</span>
            </div>
            <div className="text-center">
              <button
                onClick={onPrivacyPolicyClick}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-4 py-2 hover:bg-blue-50"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center text-gray-500 text-sm gap-3 pt-6 border-t border-gray-200">
            <span>Copyright © {new Date().getFullYear()}</span>
            <img
              src={kadoshLogo}
              alt="Kadosh AI"
              className="h-5 w-auto object-contain hover:scale-110 transition-transform"
            />
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};