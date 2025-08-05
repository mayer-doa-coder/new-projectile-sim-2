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
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
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
          <div className="col-span-12 lg:col-span-6 xl:col-span-8">
            <div className={`${
              isDayTheme ? 'bg-white' : 'bg-gray-800'
            } rounded-xl shadow-lg border ${
              isDayTheme ? 'border-gray-200' : 'border-gray-700'
            } overflow-hidden`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-lg font-semibold ${
                  isDayTheme ? 'text-gray-900' : 'text-white'
                }`}>
                  🚀 Simulation Canvas
                </h2>
              </div>
              
              <div className="p-4">
                <div className="flex justify-center">
                  <SimulationCanvas
                    simulation={simulation}
                    params={params}
                    isDayTheme={isDayTheme}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Data Panel */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
            <DataPanel
              simulation={simulation}
              params={params}
              isDayTheme={isDayTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}