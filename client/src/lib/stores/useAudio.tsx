import { create } from "zustand";
import { AudioManager } from "../systems/AudioManager";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  soundEffects: Map<string, HTMLAudioElement>;
  isMuted: boolean;
  volume: number;
  audioManager: AudioManager | null;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  addSoundEffect: (name: string, sound: HTMLAudioElement) => void;
  
  // Control functions
  initializeAudio: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playSound: (soundName: string, volume?: number) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  soundEffects: new Map(),
  isMuted: false,
  volume: 0.7,
  audioManager: null,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  
  addSoundEffect: (name, sound) => {
    const { soundEffects } = get();
    soundEffects.set(name, sound);
    set({ soundEffects: new Map(soundEffects) });
  },
  
  initializeAudio: async () => {
    try {
      const audioManager = new AudioManager();
      await audioManager.initialize();
      
      set({ audioManager });
      
      console.log("Audio system initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio system:", error);
    }
  },
  
  toggleMute: () => {
    const { isMuted, audioManager } = get();
    const newMutedState = !isMuted;
    
    if (audioManager) {
      audioManager.setMuted(newMutedState);
    }
    
    set({ isMuted: newMutedState });
    console.log(`Audio ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  setVolume: (volume) => {
    const { audioManager } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audioManager) {
      audioManager.setVolume(clampedVolume);
    }
    
    set({ volume: clampedVolume });
  },
  
  playSound: (soundName, volume = 1) => {
    const { audioManager, isMuted } = get();
    
    if (!audioManager || isMuted) return;
    
    audioManager.playSound(soundName, volume);
  },
  
  playBackgroundMusic: () => {
    const { audioManager, isMuted } = get();
    
    if (!audioManager || isMuted) return;
    
    audioManager.playBackgroundMusic();
  },
  
  stopBackgroundMusic: () => {
    const { audioManager } = get();
    
    if (!audioManager) return;
    
    audioManager.stopBackgroundMusic();
  }
}));
