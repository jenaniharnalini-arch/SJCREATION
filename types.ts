export enum AppState {
  CHECKING_KEY = 'CHECKING_KEY',
  KEY_REQUIRED = 'KEY_REQUIRED',
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface VideoConfig {
  prompt: string;
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  model: 'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview';
}

// Extend Window interface for AI Studio
declare global {
  // Define the interface that window.aistudio expects.
  // We do not redeclare window.aistudio here to avoid conflicting with the environment's declaration 
  // (which causes 'identical modifiers' and 'must be of type AIStudio' errors).
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
