import React, { useState, useEffect } from 'react';
import { Loader2, Cpu, Zap, Aperture, Network } from 'lucide-react';

const LOADING_MESSAGES = [
  "Initializing quantum flux capacitors...",
  "Compiling silicon wafer schematics...",
  "Aligning micro-transistor arrays...",
  "Rendering 4K volumetric lighting...",
  "Synchronizing holographic grids...",
  "Fusing circuit pathways...",
  "Activating neural cores...",
  "Polishing gold connectors...",
  "Simulating particle physics...",
  "Finalizing energy field cohesion..."
];

export const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[600px] bg-black/40 rounded-2xl border border-slate-800 backdrop-blur-md relative overflow-hidden">
      {/* Background Animated Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
          <Loader2 className="w-20 h-20 text-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Cpu className="w-8 h-8 text-white opacity-80 animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Generating</h2>
        
        <div className="h-8 overflow-hidden relative w-96 text-center">
          <p key={messageIndex} className="text-cyan-400 font-mono animate-[slideUp_0.5s_ease-out]">
            {`> ${LOADING_MESSAGES[messageIndex]}`}
          </p>
        </div>

        {/* Decorative Tech Elements */}
        <div className="absolute -left-32 top-10 opacity-20">
            <Network className="w-48 h-48 text-purple-500 animate-pulse" />
        </div>
        <div className="absolute -right-32 bottom-10 opacity-20">
            <Aperture className="w-48 h-48 text-cyan-500 animate-[spin_10s_linear_infinite]" />
        </div>
        
        <div className="mt-8 flex gap-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
        </div>
        
        <p className="mt-8 text-slate-500 text-xs uppercase tracking-widest">
            Estimated time: 1-2 minutes
        </p>
      </div>
    </div>
  );
};