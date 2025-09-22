import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useTowerDefense } from "./lib/stores/useTowerDefense";
import { useCards } from "./lib/stores/useCards";
import { usePerformance } from "./lib/stores/usePerformance";
import { GameCanvas } from "./components/game/GameCanvas";
import { GameUI } from "./components/ui/GameUI";
import { PerformanceMonitor } from "./components/ui/PerformanceMonitor";
import { AudioManager } from "./lib/systems/AudioManager";
import { AssetLoader } from "./lib/systems/AssetLoader";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "placeTower", keys: ["Space"] },
  { name: "pause", keys: ["KeyP"] },
  { name: "nextWave", keys: ["KeyN"] },
];

function App() {
  const { gamePhase, initializeGame } = useTowerDefense();
  const { initializeCards } = useCards();
  const { initializePerformance } = usePerformance();
  const { initializeAudio } = useAudio();
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize all systems
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        // Initialize audio system
        await initializeAudio();
        
        // Load game assets
        await AssetLoader.preloadAssets();
        
        // Initialize game systems
        initializeGame();
        initializeCards();
        initializePerformance();
        
        setAssetsLoaded(true);
        setShowCanvas(true);
        
        console.log("All game systems initialized successfully");
      } catch (error) {
        console.error("Failed to initialize game systems:", error);
      }
    };

    initializeSystems();
  }, [initializeGame, initializeCards, initializePerformance, initializeAudio]);

  if (!assetsLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading Tower Defense...</h2>
          <p className="text-gray-400 mt-2">Preparing assets and systems</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gamePhase === 'menu' && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
              <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
                  Tower Defense
                </h1>
                <p className="text-xl mb-8">Defend your base with laser towers and strategic cards!</p>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                  onClick={() => useTowerDefense.getState().startGame()}
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {(gamePhase === 'playing' || gamePhase === 'paused' || gamePhase === 'ended') && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 15, 20],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance"
                }}
              >
                <color attach="background" args={["#1a1a2e"]} />
                
                <Suspense fallback={null}>
                  <GameCanvas />
                </Suspense>
              </Canvas>
              <GameUI />
              <PerformanceMonitor />
            </>
          )}

          {/* Audio Manager initialization handled in useAudio hook */}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
