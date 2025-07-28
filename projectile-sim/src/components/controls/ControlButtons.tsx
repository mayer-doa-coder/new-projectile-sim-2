import React from 'react';
import { SimulationState } from '../../types/simulation';

interface ControlButtonsProps {
  simulation: SimulationState;
  startSimulation: () => void;
  resetSimulation: () => void;
  togglePause: () => void;
  isDayTheme: boolean;
}

export function ControlButtons({
  simulation,
  startSimulation,
  resetSimulation,
  togglePause,
  isDayTheme
}: ControlButtonsProps) {
  const buttonBaseClass = "flex flex-col items-center justify-center p-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-4">
      <h4 className={`text-sm font-medium ${
        isDayTheme ? 'text-gray-700' : 'text-gray-300'
      }`}>
        Simulation Controls
      </h4>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={startSimulation}
          disabled={simulation.isRunning && !simulation.isPaused}
          className={`${buttonBaseClass} bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700`}
        >
          <span className="text-2xl mb-1">▶️</span>
          <span className="text-xs">Start</span>
        </button>
        
        <button
          onClick={togglePause}
          disabled={!simulation.isRunning}
          className={`${buttonBaseClass} bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700`}
        >
          <span className="text-2xl mb-1">{simulation.isPaused ? '▶️' : '⏸️'}</span>
          <span className="text-xs">{simulation.isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        
        <button
          onClick={resetSimulation}
          className={`${buttonBaseClass} bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`}
        >
          <span className="text-2xl mb-1">🔄</span>
          <span className="text-xs">Reset</span>
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className={`p-3 rounded-lg text-center ${
        isDayTheme ? 'bg-gray-50' : 'bg-gray-700'
      }`}>
        <div className={`text-sm font-medium ${
          isDayTheme ? 'text-gray-900' : 'text-white'
        }`}>
          Status: {
            simulation.isRunning 
              ? (simulation.isPaused ? '⏸️ Paused' : '▶️ Running')
              : '⏹️ Stopped'
          }
        </div>
        
        {simulation.isRunning && (
          <div className={`text-xs mt-1 ${
            isDayTheme ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Progress: {(simulation.animationProgress * 100).toFixed(1)}%
          </div>
        )}
      </div>
      
      {/* Quick Tips */}
      <div className={`p-3 rounded-lg ${
        isDayTheme ? 'bg-blue-50' : 'bg-blue-900/20'
      }`}>
        <div className={`text-xs font-medium mb-2 ${
          isDayTheme ? 'text-blue-800' : 'text-blue-300'
        }`}>
          💡 Quick Tips
        </div>
        <ul className={`text-xs space-y-1 ${
          isDayTheme ? 'text-blue-700' : 'text-blue-200'
        }`}>
          <li>• Adjust parameters while simulation is paused</li>
          <li>• Try different presets for quick setups</li>
          <li>• Change canvas size for better visibility</li>
        </ul>
      </div>
    </div>
  );
}