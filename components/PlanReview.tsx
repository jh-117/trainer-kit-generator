import React, { useState } from 'react';
import { TrainingPlan } from '../types';
import { Clock, Target, Lightbulb, CheckCircle2, ChevronRight, Wand2, Edit2, Save, X, RefreshCw, Plus, Trash2 } from 'lucide-react';

interface PlanReviewProps {
  plan: TrainingPlan;
  onConfirm: () => void;
  onCancel: () => void;
  onRegenerate: () => void;
  onUpdatePlan: (updatedPlan: TrainingPlan) => void;
  isGenerating: boolean;
  isRegenerating: boolean;
}

export const PlanReview: React.FC<PlanReviewProps> = ({
  plan,
  onConfirm,
  onCancel,
  onRegenerate,
  onUpdatePlan,
  isGenerating,
  isRegenerating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<TrainingPlan>(plan);
  const handleSaveEdits = () => {
    onUpdatePlan(editedPlan);
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  const addObjective = () => {
    setEditedPlan({
      ...editedPlan,
      learningObjectives: [...editedPlan.learningObjectives, '']
    });
  };

  const removeObjective = (index: number) => {
    setEditedPlan({
      ...editedPlan,
      learningObjectives: editedPlan.learningObjectives.filter((_, i) => i !== index)
    });
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...editedPlan.learningObjectives];
    updated[index] = value;
    setEditedPlan({ ...editedPlan, learningObjectives: updated });
  };

  const addModule = () => {
    setEditedPlan({
      ...editedPlan,
      modules: [...editedPlan.modules, { title: '', description: '', durationMinutes: 30 }]
    });
  };

  const removeModule = (index: number) => {
    setEditedPlan({
      ...editedPlan,
      modules: editedPlan.modules.filter((_, i) => i !== index)
    });
  };

  const updateModule = (index: number, field: 'title' | 'description' | 'durationMinutes', value: string | number) => {
    const updated = [...editedPlan.modules];
    updated[index] = { ...updated[index], [field]: value };
    setEditedPlan({ ...editedPlan, modules: updated });
  };

  const currentPlan = isEditing ? editedPlan : plan;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Review Training Plan</h2>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Edit your training plan details' : "We've structured your topic. Ready to generate assets?"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdits}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSaveEdits}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={onCancel}
                className="text-sm text-slate-500 hover:text-slate-800 underline"
              >
                Start Over
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={currentPlan.title}
                  onChange={(e) => setEditedPlan({ ...editedPlan, title: e.target.value })}
                  className="text-xl font-bold text-slate-900 mb-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Training Title"
                />
                <div className="flex items-center text-sm text-slate-500 mb-6">
                  <input
                    type="text"
                    value={currentPlan.targetAudience}
                    onChange={(e) => setEditedPlan({ ...editedPlan, targetAudience: e.target.value })}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Target Audience"
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{currentPlan.title}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-6">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    Target: {currentPlan.targetAudience}
                  </span>
                </div>
              </>
            )}

            <h4 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                Learning Objectives
              </span>
              {isEditing && (
                <button
                  onClick={addObjective}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </h4>
            <ul className="space-y-2 mb-8">
              {currentPlan.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start text-slate-600 text-sm">
                  {isEditing ? (
                    <div className="flex items-start space-x-2 w-full">
                      <span className="mr-2 mt-3">•</span>
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => updateObjective(i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Learning objective"
                      />
                      <button
                        onClick={() => removeObjective(i)}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">•</span>
                      {obj}
                    </>
                  )}
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Course Modules
              </span>
              {isEditing && (
                <button
                  onClick={addModule}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </h4>
            <div className="space-y-4">
              {currentPlan.modules.map((mod, i) => (
                <div key={i} className="border-l-4 border-indigo-500 pl-4 py-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-start space-x-2">
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => updateModule(i, 'title', e.target.value)}
                          className="flex-1 font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Module title"
                        />
                        <input
                          type="number"
                          value={mod.durationMinutes}
                          onChange={(e) => updateModule(i, 'durationMinutes', parseInt(e.target.value) || 0)}
                          className="w-20 text-xs font-semibold text-slate-400 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="min"
                        />
                        <button
                          onClick={() => removeModule(i)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={mod.description}
                        onChange={(e) => updateModule(i, 'description', e.target.value)}
                        className="w-full text-sm text-slate-500 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Module description"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-slate-900">{mod.title}</h5>
                        <span className="text-xs font-semibold text-slate-400">{mod.durationMinutes} min</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-amber-600" />
              AI Suggestions
            </h4>
            <ul className="space-y-3">
              {plan.suggestedEnhancements.map((sugg, i) => (
                <li key={i} className="text-sm text-amber-800 bg-white/60 p-3 rounded-lg border border-amber-100/50">
                  {sugg}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
             <h4 className="font-semibold text-slate-900 mb-2">Assets to Generate</h4>
             <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>PowerPoint Slide Content</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Interactive Flashcards</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Facilitator Guide</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Participant Handout</li>
             </ul>
          </div>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating || isGenerating || isEditing}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl border-2 border-slate-300 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Regenerating Plan...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate Plan</span>
              </>
            )}
          </button>

          <button
            onClick={onConfirm}
            disabled={isGenerating || isEditing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                 <Wand2 className="w-5 h-5 animate-spin" />
                 <span>Generating Assets...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Full Kit</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
