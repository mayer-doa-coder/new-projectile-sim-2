import React, { useState } from 'react';
import { Preset } from '../../types/simulation';

interface PresetSelectorProps {
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  isDayTheme: boolean;
}

export function PresetSelector({ presets, onApplyPreset, isDayTheme }: PresetSelectorProps) {
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <div
          key={preset.name}
          className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
            isDayTheme 
              ? 'bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border-gray-200' 
              : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
          }`}
          onClick={() => onApplyPreset(preset)}
          onMouseEnter={() => setHoveredPreset(preset.name)}
          onMouseLeave={() => setHoveredPreset(null)}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">
              {preset.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${
                isDayTheme ? 'text-gray-900' : 'text-white'
              }`}>
                {preset.name}
              </div>
              
              <div className={`text-xs mt-1 ${
                isDayTheme ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {preset.description}
              </div>
              
              {/* Parameter Preview */}
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(preset.params).map(([key, value]) => {
                  if (typeof value === 'boolean') {
                    return (
                      <span
                        key={key}
                        className={`px-2 py-1 text-xs rounded-full ${
                          value
                            ? (isDayTheme ? 'bg-green-100 text-green-700' : 'bg-green-900 text-green-300')
                            : (isDayTheme ? 'bg-red-100 text-red-700' : 'bg-red-900 text-red-300')
                        }`}
                      >
                        {key === 'airResistance' ? (value ? 'Air Resistance' : 'Vacuum') : `${key}: ${value}`}
                      </span>
                    );
                  }
                  
                  return (
                    <span
                      key={key}
                      className={`px-2 py-1 text-xs rounded-full font-mono ${
                        isDayTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {key}: {value}{key === 'velocity' ? 'm/s' : key === 'angle' ? '°' : key === 'mass' ? 'kg' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Apply Button */}
            <div className={`flex-shrink-0 transition-opacity duration-200 ${
              hoveredPreset === preset.name ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDayTheme 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                Apply
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Tooltip */}
      {hoveredPreset && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg pointer-events-none">
          Click to apply {hoveredPreset} preset
        </div>
      )}
    </div>
  );
}