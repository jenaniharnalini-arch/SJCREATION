import React from 'react';
import { Download, RefreshCw, Play } from 'lucide-react';

interface VideoDisplayProps {
  videoUrl: string;
  onReset: () => void;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-[fadeIn_1s_ease-out]">
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <video 
          src={videoUrl} 
          controls 
          autoPlay 
          loop
          className="w-full h-auto max-h-[70vh] object-contain bg-slate-950"
        />

        {/* Overlay Details */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-green-400">RENDER COMPLETE</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <a 
          href={videoUrl} 
          download="cpu_reveal_cinematic.mp4"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
        >
          <Download className="w-5 h-5" />
          Download MP4
        </a>
        
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-all border border-slate-700"
        >
          <RefreshCw className="w-5 h-5" />
          Generate New
        </button>
      </div>
    </div>
  );
};