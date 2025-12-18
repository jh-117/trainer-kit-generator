import React, { useState } from 'react';
import { Slide } from '../../types';
import { ChevronLeft, ChevronRight, Edit2, Eye, EyeOff, StickyNote, X } from 'lucide-react';
import { stripMarkdown } from '../../utils/pptxGenerator';

interface SlideViewProps {
  slides: Slide[];
  currentSlide: number;
  slideDirection: 'next' | 'prev';
  onNext: () => void;
  onPrev: () => void;
  onEdit: () => void;
}

export const SlideView: React.FC<SlideViewProps> = ({
  slides,
  currentSlide,
  slideDirection,
  onNext,
  onPrev,
  onEdit,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const slide = slides[currentSlide];

  const searchTerm = slide.visualSearchTerm || slide.title;
  const bgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    searchTerm + " high quality professional corporate business stock photo unsplash pexels"
  )}?width=1280&height=720&nologo=true&model=flux&seed=${currentSlide}`;

  const animationClass = slideDirection === 'next' 
    ? 'animate-slide-in-right' 
    : 'animate-slide-in-left';

  return (
    <div className="space-y-6 print:hidden">
      {/* Navigation */}
      <div className="flex justify-center items-center space-x-6 mb-4">
        <button 
          onClick={onPrev}
          disabled={currentSlide === 0}
          aria-label="Previous Slide"
          className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-600 shadow-md border border-slate-100 disabled:opacity-30 transition-all hover:-translate-x-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center" aria-live="polite">
          <span className="block text-xl font-bold text-slate-800 tabular-nums">
            {currentSlide + 1} <span className="text-slate-300 font-light mx-1">/</span> {slides.length}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-widest">Slide</span>
        </div>
        
        <button 
          onClick={onNext}
          disabled={currentSlide === slides.length - 1}
          aria-label="Next Slide"
          className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-600 shadow-md border border-slate-100 disabled:opacity-30 transition-all hover:translate-x-1"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Slide Display */}
      <div className="max-w-5xl mx-auto w-full">
        <article 
          className={`bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 h-full flex flex-col relative group aspect-video ${animationClass}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-slate-800">
            <img 
              src={bgUrl} 
              alt=""
              className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[30s] ease-linear"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          </div>

          {/* Control Actions */}
          <div className="absolute top-4 right-4 z-30 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Edit</span>
            </button>
          </div>

          {/* Slide Content */}
          <div className="relative z-10 flex flex-col h-full p-8 md:p-12 lg:p-16">
            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight drop-shadow-xl max-w-4xl font-display">
                {slide.title}
              </h3>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest bg-indigo-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30 shrink-0 ml-4 shadow-inner">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
            
            <div className="flex-grow">
              <ul className="space-y-6">
                {slide.content.map((point, i) => (
                  <li key={i} className="flex items-start group/item">
                    <span className="flex-shrink-0 w-2.5 h-2.5 mt-3 rounded-full bg-indigo-400 mr-5 group-hover/item:bg-indigo-300 group-hover/item:shadow-[0_0_15px_rgba(129,140,248,0.6)] transition-all" />
                    <span className="text-xl md:text-2xl text-slate-100 font-light leading-relaxed tracking-wide shadow-black drop-shadow-md">
                      {stripMarkdown(point)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6 flex justify-between items-end opacity-80">
              <div className="flex items-center space-x-3">
                <div className="h-1 w-12 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">TrainerKit GenAI</div>
              </div>
              
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="hidden md:flex items-center text-xs text-slate-400 hover:text-white transition-colors bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20"
              >
                {showNotes ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
                Speaker Notes
              </button>
            </div>
          </div>

          {/* Speaker Notes Overlay */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl p-8 border-t border-indigo-500/30 transition-all duration-300 transform z-20 ${
              showNotes ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <StickyNote className="w-3 h-3 mr-2"/> Speaker Notes
              </p>
              <button onClick={() => setShowNotes(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-base text-slate-200 leading-relaxed font-light">{slide.speakerNotes}</p>
          </div>
        </article>
        
        {/* Mobile Speaker Notes */}
        <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm md:hidden">
          <p className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center">
            <StickyNote className="w-4 h-4 mr-2"/> Speaker Notes
          </p>
          <p className="text-sm text-slate-600 italic leading-relaxed">{slide.speakerNotes}</p>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(40px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-40px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in-right {
          animation: slideInFromRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};