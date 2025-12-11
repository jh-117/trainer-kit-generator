import React, { useState } from 'react';
import { GeneratedKit, Slide } from '../types';
import { Layout, Presentation, FileText, StickyNote, Download, Loader2 } from 'lucide-react';
import { SlideView } from './kit/SlideView';
import { FlashcardView } from './kit/FlashcardView';
import { MarkdownView } from './kit/MarkdownView';
import { EditSlideModal } from './kit/EditSlideModal';
import { downloadKit } from '../utils/downloadKit';

interface KitResultsProps {
  kit: GeneratedKit;
  onReset: () => void;
  onUpdateKit: (kit: GeneratedKit) => void;
}

export const KitResults: React.FC<KitResultsProps> = ({ kit, onReset, onUpdateKit }) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'flashcards' | 'guide' | 'handout'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageSeeds, setImageSeeds] = useState<Record<number, number>>({});
  
  // Editing State
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlideData, setEditingSlideData] = useState<Slide | null>(null);

  const tabs = [
    { id: 'slides', label: 'Presentation', icon: Presentation },
    { id: 'flashcards', label: 'Flashcards', icon: StickyNote },
    { id: 'guide', label: 'Facilitator Guide', icon: Layout },
    { id: 'handout', label: 'Handout', icon: FileText },
  ];

  const handleEditClick = () => {
    setEditingSlideData({ ...kit.slides[currentSlide] });
    setIsEditingSlide(true);
  };

  const handleRefreshImage = () => {
    setImageSeeds(prev => ({
      ...prev,
      [currentSlide]: (prev[currentSlide] || 0) + 1
    }));
  };

  const handleSaveSlide = () => {
    if (!editingSlideData) return;

    // Create a new kit object with the updated slide
    const updatedSlides = [...kit.slides];
    updatedSlides[currentSlide] = editingSlideData;
    
    const updatedKit = {
      ...kit,
      slides: updatedSlides
    };

    onUpdateKit(updatedKit);
    setIsEditingSlide(false);
  };

  const handleNextSlide = () => {
    if (currentSlide < kit.slides.length - 1) {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadKit(kit, imageSeeds);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to create download package. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 print:space-y-0 print:max-w-none print:w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Trainer Kit</h2>
          <p className="text-slate-500">Ready for download and delivery.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm hover:shadow transition-all"
          >
            New Kit
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
          >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Bundling..." : "Download Package"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="flex overflow-x-auto pb-2 border-b border-slate-200 space-x-1 print:hidden"
        role="tablist"
        aria-label="Content Views"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 rounded-t-lg font-medium transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isActive 
                  ? 'bg-white border-x border-t border-slate-200 text-indigo-600 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] translate-y-[1px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[600px] mt-6 print:mt-0 print:min-h-0" role="tabpanel" id={`${activeTab}-panel`}>
        {/* SLIDES TAB */}
        {activeTab === 'slides' && (
           <SlideView 
              slides={kit.slides}
              currentSlide={currentSlide}
              slideDirection={slideDirection}
              imageSeeds={imageSeeds}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
              onEdit={handleEditClick}
              onRefreshImage={handleRefreshImage}
           />
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:hidden">
            {kit.flashcards.map((card, i) => (
              <FlashcardView key={i} card={card} index={i} />
            ))}
          </div>
        )}

        {/* GUIDE TAB */}
        {activeTab === 'guide' && (
          <MarkdownView 
            content={kit.facilitatorGuideMarkdown} 
            title="Facilitator Guide" 
          />
        )}

        {/* HANDOUT TAB */}
        {activeTab === 'handout' && (
          <MarkdownView 
            content={kit.handoutMarkdown} 
            title="Participant Handout"
            showPrintButton={true} 
          />
        )}
      </div>

      {/* Edit Slide Modal */}
      {isEditingSlide && editingSlideData && (
        <EditSlideModal 
          slideData={editingSlideData}
          onClose={() => setIsEditingSlide(false)}
          onSave={handleSaveSlide}
          onChange={setEditingSlideData}
        />
      )}
    </div>
  );
};