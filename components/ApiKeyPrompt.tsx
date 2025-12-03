import React from 'react';
import { Key, ExternalLink, ShieldAlert } from 'lucide-react';

interface ApiKeyPromptProps {
  onSelectKey: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-8 max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Key className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Access Required
          </h1>
          
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            To generate high-quality cinematic AI videos with Veo, you need to connect a paid Google Cloud Project API key.
          </p>

          <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-lg mb-8 text-left flex gap-3">
             <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
             <div className="text-sm text-amber-200/80">
                <p className="font-semibold text-amber-500 mb-1">Billing Enabled Project Required</p>
                Video generation is a premium feature. Please ensure you select a project with billing enabled in the Google Cloud Console.
             </div>
          </div>

          <button
            onClick={onSelectKey}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-cyan-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2">
              Select API Key <ExternalLink className="w-4 h-4" />
            </span>
          </button>

          <div className="mt-6 text-slate-500 text-sm">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 underline underline-offset-4 transition-colors"
            >
              Read about Gemini API billing & pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};