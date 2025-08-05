import React from 'react';
import { SimulationParams } from '../../types/simulation';

interface CanvasSizeControlsProps {
  params: SimulationParams;
  updateParams: (params: Partial<SimulationParams>) => void;
  isDayTheme: boolean;
}

const CANVAS_PRESETS = [
  { name: 'Small', width: 600, height: 400, icon: '' },
  { name: 'Medium', width: 800, height: 500, icon: '' },
  { name: 'Large', width: 1000, height: 600, icon: '' },
  { name: 'Wide', width: 1200, height: 500, icon: '' },
  { name: 'Square', width: 600, height: 600, icon: '' },
  { name: 'Tall', width: 600, height: 800, icon: '' }
];

export function CanvasSizeControls({ params, updateParams, isDayTheme }: CanvasSizeControlsProps) {
  const handlePresetSelect = (preset: typeof CANVAS_PRESETS[0]) => {
    updateParams({
      canvasWidth: preset.width,
      canvasHeight: preset.height
    });
  };

  const handleCustomSize = (dimension: 'width' | 'height', value: number) => {
    updateParams({
      [dimension === 'width' ? 'canvasWidth' : 'canvasHeight']: value
    });
  };

  const currentAspectRatio = (params.canvasWidth / params.canvasHeight).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Current Size Display */}
      <div className={`p-4 rounded-lg ${
        isDayTheme ? 'bg-gray-50' : 'bg-gray-700'
      }`}>
        <div className="text-center">
          <div className={`text-2xl font-mono ${
            isDayTheme ? 'text-gray-900' : 'text-white'
          }`}>
            {params.canvasWidth} × {params.canvasHeight}
          </div>
          <div className={`text-sm ${
            isDayTheme ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Aspect Ratio: {currentAspectRatio}:1
          </div>
        </div>
      </div>

      {/* Preset Sizes */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${
          isDayTheme ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Quick Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CANVAS_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${
                params.canvasWidth === preset.width && params.canvasHeight === preset.height
                  ? (isDayTheme 
                      ? 'bg-blue-100 border-blue-200 text-blue-900' 
                      : 'bg-blue-900 border-blue-700 text-blue-100')
                  : (isDayTheme 
                      ? 'bg-gray-50 hover:bg-gray-100 border-gray-200' 
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600')
              } border`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{preset.icon}</span>
                <div>
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className={`text-xs ${
                    isDayTheme ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {preset.width} × {preset.height}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size Controls */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${
          isDayTheme ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Custom Size
        </h4>
        
        <div className="space-y-4">
          {/* Width Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Width
              </label>
              <span className={`text-sm font-mono px-2 py-1 rounded ${
                isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
              }`}>
                {params.canvasWidth}px
              </span>
            </div>
            <input
              type="range"
              min={400}
              max={1600}
              step={50}
              value={params.canvasWidth}
              onChange={(e) => handleCustomSize('width', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 accent-blue-500"
            />
            <div className="flex justify-between text-xs text-green-500 dark:text-gray-400 mt-1">
              <span>400px</span>
              <span>1600px</span>
            </div>
          </div>

          {/* Height Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Height
              </label>
              <span className={`text-sm font-mono px-2 py-1 rounded ${
                isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
              }`}>
                {params.canvasHeight}px
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={1000}
              step={50}
              value={params.canvasHeight}
              onChange={(e) => handleCustomSize('height', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>300px</span>
              <span>1000px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${
          isDayTheme ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateParams({
              canvasWidth: params.canvasHeight,
              canvasHeight: params.canvasWidth
            })}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDayTheme 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            Rotate
          </button>
          <button
            onClick={() => {
              const aspectRatio = params.canvasWidth / params.canvasHeight;
              const newHeight = Math.round(params.canvasWidth / aspectRatio);
              updateParams({ canvasHeight: newHeight });
            }}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDayTheme 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
              Fix Ratio
          </button>
        </div>
      </div>
    </div>
  );
}