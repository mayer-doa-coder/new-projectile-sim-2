'use client';

import React, { useState } from 'react';
import { SimulationCanvas } from './simulation/SimulationCanvas';
import { ControlPanel } from './controls/ControlPanel';
import { DataPanel } from './data/DataPanel';
import { Header } from './layout/Header';
import { useSimulation } from '../hooks/useSimulation';
import { SimulationParams } from '../types/simulation';

const DEFAULT_PARAMS: SimulationParams = {
  velocity: 45,
  angle: 45,
  mass: 25,
  airResistance: true,
  gravity: 9.81,
  canvasWidth: 800,
  canvasHeight: 500,
  cannonHeight: 1.5
};

export default function ProjectileSimulator() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [isDayTheme, setIsDayTheme] = useState(true);
  
  const {
    simulation,
    startSimulation,
    resetSimulation,
    togglePause
  } = useSimulation(params);

  const updateParams = (newParams: Partial<SimulationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDayTheme ? 'bg-gradient-to-br from-blue-50 to-green-50' : 'bg-gradient-to-br from-gray-900 to-blue-900'
    }`}>
      <Header 
        simulation={simulation}
        isDayTheme={isDayTheme}
        setIsDayTheme={setIsDayTheme}
        params={params}
        updateParams={updateParams}
      />

      <div className="max-w-full mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Control Panel */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <ControlPanel
              params={params}
              updateParams={updateParams}
              simulation={simulation}
              startSimulation={startSimulation}
              resetSimulation={resetSimulation}
              togglePause={togglePause}
              isDayTheme={isDayTheme}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            <div className={`${
              isDayTheme ? 'bg-white' : 'bg-gray-800'
            } rounded-xl shadow-lg border ${
              isDayTheme ? 'border-gray-200' : 'border-gray-700'
            } overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h2 className={`text-lg font-semibold ${
                    isDayTheme ? 'text-gray-900' : 'text-white'
                  }`}>
                    Simulation Canvas
                  </h2>
                  
                  {/* Simulation Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={startSimulation}
                      disabled={simulation.isRunning && !simulation.isPaused}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                      
                      <span className="text-sm">Start</span>
                    </button>
                    
                    <button
                      onClick={togglePause}
                      disabled={!simulation.isRunning}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                    >
                      
                      <span className="text-sm">{simulation.isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    
                    <button
                      onClick={resetSimulation}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    >
                      <span className="text-sm">Reset</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Canvas Container */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      <SimulationCanvas
                        simulation={simulation}
                        params={params}
                        isDayTheme={isDayTheme}
                        updateParams={updateParams}
                      />
                      
                      {/* Live Results Overlay */}
                      {simulation.currentProjectile && (
                        <div className={`absolute top-4 right-4 ${
                          isDayTheme ? 'bg-white/90 border-gray-200' : 'bg-gray-800/90 border-gray-600'
                        } backdrop-blur-sm border rounded-lg shadow-lg p-3 min-w-[200px]`}>
                          <div className={`text-sm font-semibold mb-2 ${
                            isDayTheme ? 'text-gray-900' : 'text-white'
                          }`}>
                            Live Data
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div className={`${
                              isDayTheme ? 'text-blue-700' : 'text-blue-300'
                            }`}>
                              <div className="font-medium">Position</div>
                              <div className="font-mono">
                                X: {simulation.currentProjectile.x.toFixed(1)}m<br/>
                                Y: {simulation.currentProjectile.y.toFixed(1)}m
                              </div>
                            </div>
                            
                            <div className={`${
                              isDayTheme ? 'text-green-700' : 'text-green-300'
                            }`}>
                              <div className="font-medium">Velocity</div>
                              <div className="font-mono">
                                Vₓ: {simulation.currentProjectile.vx.toFixed(1)}m/s<br/>
                                Vᵧ: {simulation.currentProjectile.vy.toFixed(1)}m/s
                              </div>
                            </div>
                            
                            <div className={`${
                              isDayTheme ? 'text-purple-700' : 'text-purple-300'
                            }`}>
                              <div className="font-medium">Speed & Time</div>
                              <div className="font-mono">
                                Speed: {Math.sqrt(simulation.currentProjectile.vx ** 2 + simulation.currentProjectile.vy ** 2).toFixed(1)} m/s<br/>
                                Time: {simulation.currentProjectile.time.toFixed(2)}s
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Data Panel */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-2">
            <div className="hidden xl:block">
              <DataPanel
                simulation={simulation}
                params={params}
                isDayTheme={isDayTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}