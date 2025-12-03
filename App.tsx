import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Film, Sparkles, Settings2, AlertTriangle } from 'lucide-react';
import { checkApiKeySelection, promptForApiKey, generateVideo } from './services/geminiService';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { LoadingScreen } from './components/LoadingScreen';
import { VideoDisplay } from './components/VideoDisplay';
import { AppState, VideoConfig } from './types';

const DEFAULT_PROMPT = `Create a high-tech cinematic video showing individual CPU components arriving from different directions in a dramatic, futuristic environment. Start with a dark technological space filled with floating holographic grids, particle effects, and glowing circuit patterns. One by one, CPU elements appear: the silicon wafer, transistor layers, gold connectors, pins, cooling plate, microchip layers, and circuit pathways. Each part enters the scene in smooth motion—some sliding in, some dropping from above, some materializing through digital warp portals. Use glowing neon colors like electric blue, green, and purple to highlight edges.
As all components reach the center, activate an energy field: particles swirl, light beams connect, and the parts rotate in synchronization. Show them snapping, locking, and magnetically pulling together with detailed sci-fi VFX. Micro-circuits light up as the internal layers fuse, forming the final CPU body. End with a powerful flash of energy as the fully assembled CPU hovers in the air, glowing with an activated core. The camera performs a slow dramatic orbit around the finished chip. Add ultra-realistic CGI, crisp reflections, volumetric lighting, 4K details, smooth animations, and a premium tech-reveal atmosphere`;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CHECKING_KEY);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Configuration State
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [modelType, setModelType] = useState<'fast' | 'quality'>('fast');

  const checkKey = useCallback(async () => {
    try {
      const hasKey = await checkApiKeySelection();
      setAppState(hasKey ? AppState.IDLE : AppState.KEY_REQUIRED);
    } catch (e) {
      console.error("Error checking key:", e);
      setAppState(AppState.KEY_REQUIRED);
    }
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleSelectKey = async () => {
    try {
      await promptForApiKey();
      // Assume success if no error thrown, or re-check
      await checkKey();
    } catch (e) {
      console.error("Failed to select key:", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setAppState(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const config: VideoConfig = {
        prompt,
        resolution,
        aspectRatio,
        model: modelType === 'quality' ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview'
      };

      const url = await generateVideo(config);
      setVideoUrl(url);
      setAppState(AppState.COMPLETE);
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message === 'API_KEY_INVALID') {
        setAppState(AppState.KEY_REQUIRED);
        setErrorMsg("The selected API key was invalid or not found. Please select a valid key.");
      } else {
        setAppState(AppState.ERROR);
        setErrorMsg(error.message || "An unknown error occurred during video generation.");
      }
    }
  };

  const resetApp = () => {
    setVideoUrl(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  // Render Logic
  if (appState === AppState.CHECKING_KEY) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500">
      <Sparkles className="animate-spin w-8 h-8" />
    </div>;
  }

  if (appState === AppState.KEY_REQUIRED) {
    return <ApiKeyPrompt onSelectKey={handleSelectKey} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-900/30 rounded-lg border border-cyan-500/30 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-xl font-bold tracking-wider font-orbitron bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              CYBER_CPU_REVEAL
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/70 border border-cyan-900/30 px-3 py-1 rounded-full bg-cyan-950/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            SYSTEM ONLINE
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {appState === AppState.ERROR && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-500/50 rounded-lg flex items-start gap-4 text-red-200">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="font-bold">System Error</h3>
              <p className="text-sm opacity-80">{errorMsg}</p>
              <button onClick={() => setAppState(AppState.IDLE)} className="mt-2 text-xs underline hover:text-white">Try Again</button>
            </div>
          </div>
        )}

        {appState === AppState.COMPLETE && videoUrl ? (
          <VideoDisplay videoUrl={videoUrl} onReset={resetApp} />
        ) : appState === AppState.GENERATING ? (
          <div className="max-w-4xl mx-auto">
             <LoadingScreen />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 text-cyan-400">
                  <Film className="w-5 h-5" />
                  <h2 className="font-bold tracking-wide">VISUAL DIRECTIVE</h2>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-80 bg-black/50 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-700"
                  placeholder="Describe your cinematic CPU reveal..."
                />
                 <div className="mt-2 text-right text-xs text-slate-600 font-mono">
                  {prompt.length} CHARS
                </div>
              </div>

            </div>

            {/* Right Column: Settings */}
            <div className="space-y-6">
               <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
                  <div className="flex items-center gap-2 mb-6 text-purple-400">
                    <Settings2 className="w-5 h-5" />
                    <h2 className="font-bold tracking-wide">CONFIGURATION</h2>
                  </div>

                  <div className="space-y-6">
                    
                    {/* Model Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Render Engine</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-lg border border-slate-800">
                        <button 
                          onClick={() => setModelType('fast')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${modelType === 'fast' ? 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Turbo (Fast)
                        </button>
                        <button 
                          onClick={() => setModelType('quality')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${modelType === 'quality' ? 'bg-purple-900/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Pro (Quality)
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {modelType === 'quality' ? 'Supports higher detail, takes longer.' : 'Optimized for speed. Good for drafts.'}
                      </p>
                    </div>

                    {/* Aspect Ratio */}
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${aspectRatio === '16:9' ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400' : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-600'}`}
                          >
                             <div className="w-8 h-5 border-2 border-current rounded-sm"></div>
                             <span className="text-xs font-bold">16:9</span>
                          </button>
                          <button 
                             onClick={() => setAspectRatio('9:16')}
                             className={`flex-1 border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${aspectRatio === '9:16' ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400' : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-600'}`}
                          >
                             <div className="w-5 h-8 border-2 border-current rounded-sm"></div>
                             <span className="text-xs font-bold">9:16</span>
                          </button>
                       </div>
                    </div>

                    {/* Resolution */}
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolution</label>
                       <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value as '720p' | '1080p')}
                        className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none"
                       >
                         <option value="1080p">1080p (FHD)</option>
                         <option value="720p">720p (HD)</option>
                       </select>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-[spin_4s_linear_infinite] opacity-70"></div>
                         <div className="relative bg-slate-950 rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all group-hover:bg-slate-900">
                            <Sparkles className="w-5 h-5 text-white group-hover:animate-pulse" />
                            <span className="font-bold text-white tracking-wider">INITIATE SEQUENCE</span>
                         </div>
                      </button>
                    </div>

                  </div>
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;