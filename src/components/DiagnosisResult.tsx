/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { FormData, DiagnosisResult as DiagnosisResultType } from '../types';

interface DiagnosisResultProps {
  formData: FormData;
  onStartOver: () => void;
}



export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ formData, onStartOver }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DiagnosisResultType | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        console.log('Form data submitted:', formData);
        // Use localhost python server for local dev on Windows, and relative route for live Vercel
        const apiUrl = import.meta.env.PROD ? '/api/predict' : 'http://localhost:8000/api/predict';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch diagnosis');
        }
        
        const resultData = await response.json();
        setResult(resultData);
      } catch (error) {
        console.error('Error fetching prediction:', error);
        // Fallback incase backend is down
        setResult({ diagnosis: 'Error Backend Down', sensitivity: 'N/A', specificity: 'N/A' });
      } finally {
        setLoading(false);
      }
    };

    // Keep artificial delay for better UX
    const timer = setTimeout(() => {
      fetchPrediction();
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-cyan-300 animate-ping animation-delay-200" />
            <div className="absolute inset-4 rounded-full border-4 border-teal-400 animate-ping animation-delay-400" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Data</h2>
          <p className="text-slate-500">Our AI model is processing the patient information...</p>
          
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Processing symptoms and signs
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse animation-delay-200" />
              Analyzing laboratory values
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse animation-delay-400" />
              Generating diagnosis
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4 animate-bounce-once">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Diagnosis Complete</h2>
        <p className="text-slate-500 mt-2">Based on the provided information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Main Diagnosis */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-center">
          <p className="text-teal-100 text-sm font-medium uppercase tracking-wider mb-2">Probable Diagnosis</p>
          <h3 className="text-4xl font-bold text-white">{result.diagnosis}</h3>
        </div>

        {/* Metrics */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-3">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mb-1">Sensitivity</p>
              <p className="text-3xl font-bold text-slate-800">{result.sensitivity}</p>
              <p className="text-xs text-slate-400 mt-1">True positive rate</p>
            </div>
            
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 mb-3">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mb-1">Specificity</p>
              <p className="text-3xl font-bold text-slate-800">{result.specificity}</p>
              <p className="text-xs text-slate-400 mt-1">True negative rate</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">Medical Disclaimer</p>
                <p className="text-xs text-amber-700 mt-1">
                  This is a preliminary diagnosis suggestion and should not replace professional medical advice. 
                  Please consult with a qualified healthcare provider for definitive diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Patient Assessment
        </button>
      </div>
    </div>
  );
};
