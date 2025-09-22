import { useState } from "react";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import { useCards } from "@/lib/stores/useCards";
import { useAudio } from "@/lib/stores/useAudio";
import { CardHand } from "./CardHand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";

export function GameUI() {
  const { 
    gamePhase, 
    currentWave, 
    totalWaves, 
    lives, 
    score, 
    money,
    pauseGame,
    resumeGame,
    nextWave,
    restartGame,
    waveProgress 
  } = useTowerDefense();
  
  const { isMuted, toggleMute } = useAudio();
  const [showStats, setShowStats] = useState(false);

  const handlePauseToggle = () => {
    if (gamePhase === 'playing') {
      pauseGame();
    } else if (gamePhase === 'paused') {
      resumeGame();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Game Stats */}
        <Card className="bg-black/80 text-white border-gray-600">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-600">
                Wave {currentWave}/{totalWaves}
              </Badge>
              <div className="text-sm">
                Lives: <span className="text-red-400 font-bold">{lives}</span>
              </div>
              <div className="text-sm">
                Score: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
              </div>
              <div className="text-sm">
                Money: <span className="text-green-400 font-bold">${money}</span>
              </div>
            </div>
            
            {/* Wave Progress */}
            <div className="w-48">
              <div className="flex justify-between text-xs mb-1">
                <span>Wave Progress</span>
                <span>{Math.round(waveProgress * 100)}%</span>
              </div>
              <Progress value={waveProgress * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="bg-black/80 text-white border-gray-600 hover:bg-gray-700"
          >
            Stats
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="bg-black/80 text-white border-gray-600 hover:bg-gray-700"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseToggle}
            className="bg-black/80 text-white border-gray-600 hover:bg-gray-700"
          >
            {gamePhase === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={restartGame}
            className="bg-black/80 text-white border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pause Overlay */}
      {gamePhase === 'paused' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
              <p className="mb-6">Press P to resume or click the play button</p>
              <Button onClick={resumeGame} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Resume Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Overlay */}
      {gamePhase === 'ended' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600">
            <CardContent className="p-8 text-center">
              <h2 className="text-4xl font-bold mb-4 text-red-400">Game Over</h2>
              <div className="space-y-2 mb-6">
                <p className="text-xl">Final Score: <span className="text-yellow-400">{score.toLocaleString()}</span></p>
                <p>Waves Completed: {currentWave - 1}/{totalWaves}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={restartGame} size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => useTowerDefense.getState().setGamePhase('menu')}
                  size="lg"
                  className="border-gray-600 hover:bg-gray-700"
                >
                  Main Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom UI - Card Hand */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <CardHand />
      </div>

      {/* Side UI - Next Wave Button */}
      {gamePhase === 'playing' && waveProgress >= 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <Button
            onClick={nextWave}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6"
          >
            Next Wave
          </Button>
        </div>
      )}

      {/* Statistics Panel */}
      {showStats && (
        <div className="absolute top-20 right-4 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 w-64">
            <CardContent className="p-4">
              <h3 className="font-bold mb-3">Game Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Enemies Killed:</span>
                  <span>{useTowerDefense.getState().enemiesKilled}</span>
                </div>
                <div className="flex justify-between">
                  <span>Towers Built:</span>
                  <span>{useTowerDefense.getState().towers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span>{Math.round(useTowerDefense.getState().accuracy * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Played:</span>
                  <span>{Math.round(useTowerDefense.getState().gameTime)}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
