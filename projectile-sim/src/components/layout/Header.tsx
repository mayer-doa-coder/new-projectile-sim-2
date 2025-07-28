import React from 'react';
import { HeaderProps } from '../../types/simulation';

export function Header({ 
  simulation, 
  isDayTheme, 
  setIsDayTheme, 
  params, 
  updateParams 
}: HeaderProps) {
  return (
    <div className={`${
      isDayTheme ? 'bg-white/90 backdrop-blur-sm' : 'bg-gray-800/90 backdrop-blur-sm'
    } border-b ${
      isDayTheme ? 'border-gray-200' : 'border-gray-700'
    } sticky top-0 z-50`}>
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <h1 className={`text-2xl font-bold ${
              isDayTheme ? 'text-gray-900' : 'text-white'
            }`}>
              🎯 Projectile Motion Simulator
            </h1>
            
            {/* Simulation Metrics */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className={`px-3 py-1 rounded-full ${
                isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
              }`}>
                Max Height: {simulation.maxHeight.toFixed(1)}m
              </div>
              <div className={`px-3 py-1 rounded-full ${
                isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
              }`}>
                Range: {simulation.range.toFixed(1)}m
              </div>
              <div className={`px-3 py-1 rounded-full ${
                isDayTheme ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200'
              }`}>
                Time: {simulation.timeOfFlight.toFixed(1)}s
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Canvas Size Indicator */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isDayTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
            }`}>
              <span>📐</span>
              <span className="font-mono">{params.canvasWidth}×{params.canvasHeight}</span>
            </div>

            {/* Air Resistance Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Air Resistance
              </span>
              <button
                onClick={() => updateParams({ airResistance: !params.airResistance })}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  params.airResistance ? 'bg-red-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  params.airResistance ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {isDayTheme ? '☀️' : '🌙'}
              </span>
              <button
                onClick={() => setIsDayTheme(!isDayTheme)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  isDayTheme ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  isDayTheme ? 'translate-x-1' : 'translate-x-7'
                }`} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Metrics */}
        <div className="md:hidden flex items-center space-x-2 mt-3 text-xs overflow-x-auto">
          <div className={`px-2 py-1 rounded-full whitespace-nowrap ${
            isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
          }`}>
            H: {simulation.maxHeight.toFixed(1)}m
          </div>
          <div className={`px-2 py-1 rounded-full whitespace-nowrap ${
            isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
          }`}>
            R: {simulation.range.toFixed(1)}m
          </div>
          <div className={`px-2 py-1 rounded-full whitespace-nowrap ${
            isDayTheme ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200'
          }`}>
            T: {simulation.timeOfFlight.toFixed(1)}s
          </div>
          <div className={`px-2 py-1 rounded-full whitespace-nowrap font-mono ${
            isDayTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'
          }`}>
            {params.canvasWidth}×{params.canvasHeight}
          </div>
        </div>
      </div>
    </div>
  );
}