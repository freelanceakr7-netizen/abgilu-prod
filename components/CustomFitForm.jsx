import React, { useState } from 'react';
import { Ruler, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const CustomFitForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '',
    chest: '',
    waist: '',
    length: '',
    preference: 'Standard Comfort'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-white/40 backdrop-blur-sm border border-indigo/5 p-8 md:p-12 rounded-none shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo rounded-none flex items-center justify-center text-kora">
          <Ruler className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-indigo">The Guided Atelier</h2>
          <p className="text-xs text-terracotta uppercase tracking-widest">Personalized Precision</p>
        </div>
      </div>

      <div className="mb-12 flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo/10 -z-10"></div>
        {[1, 2, 3].map(num => (
          <div key={num} className={`w-8 h-8 rounded-none flex items-center justify-center text-xs transition-colors duration-500 ${
            step === num ? 'bg-terracotta text-white' : step > num ? 'bg-indigo text-white' : 'bg-kora border border-indigo/20 text-indigo/40'
          }`}>
            {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
          </div>
        ))}
      </div>

      <div className="min-h-[300px] flex flex-col">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-lg font-serif mb-6">Essential Dimensions</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-indigo/60">Full Height (cm)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 170" 
                  className="w-full bg-transparent border-b border-indigo/20 focus:border-terracotta py-2 outline-none transition-colors"
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-indigo/60">Bust/Chest (cm)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 92" 
                  className="w-full bg-transparent border-b border-indigo/20 focus:border-terracotta py-2 outline-none transition-colors"
                  value={formData.chest}
                  onChange={e => setFormData({...formData, chest: e.target.value})}
                />
              </div>
            </div>
            <p className="mt-8 text-xs italic text-indigo/60 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              Tip: Measure over your standard undergarments for the most accurate fit.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-lg font-serif mb-6">Silhouette & Draping</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-indigo/60">Natural Waist (cm)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 74" 
                  className="w-full bg-transparent border-b border-indigo/20 focus:border-terracotta py-2 outline-none transition-colors"
                  value={formData.waist}
                  onChange={e => setFormData({...formData, waist: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-indigo/60">Preferred Silhouette</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Sculpted Fit', 'Relaxed Bloom', 'A-Line Swing', 'Standard Comfort'].map(pref => (
                    <button 
                      key={pref}
                      onClick={() => setFormData({...formData, preference: pref})}
                      className={`p-4 text-sm border transition-all ${
                        formData.preference === pref ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-indigo/10 hover:border-indigo/30'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-none flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-2xl font-serif mb-4">Measurements Captured</h3>
            <p className="text-sm text-indigo/60 mb-8 leading-relaxed">
              Our master tailors will now review your profile. These dimensions will be saved to your Atelier Profile for all future orders.
            </p>
            <div className="bg-kora p-6 text-left rounded-none border border-gold/20">
              <div className="flex justify-between text-xs mb-2">
                <span className="opacity-50">Height / Chest</span>
                <span className="font-bold">{formData.height}cm / {formData.chest}cm</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="opacity-50">Style Goal</span>
                <span className="font-bold">{formData.preference}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-between items-center">
        {step < 3 ? (
          <>
            <button 
              onClick={prevStep}
              className={`text-xs uppercase tracking-widest transition-opacity ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
            >
              Back
            </button>
            <button 
              onClick={nextStep}
              className="bg-indigo text-kora px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 hover:bg-indigo-dark transition-all rounded-none"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            className="w-full bg-indigo text-kora py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-indigo-dark transition-all rounded-none"
          >
            Apply to Current Order
          </button>
        )}
      </div>
    </div>
  );
};


