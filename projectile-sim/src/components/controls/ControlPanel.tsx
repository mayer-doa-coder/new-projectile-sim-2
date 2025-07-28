import React, { useState } from 'react';
import { ControlPanelProps, Preset } from '../../types/simulation';
import { ParameterSlider } from './ParameterSlider';
import { PresetSelector } from './PresetSelector';
import { ControlButtons } from './ControlButtons';
import { CanvasSizeControls } from './CanvasSizeControls';

const PRESETS: Preset[] = [
  {
    name: "Cannon Ball",
    icon: "⚫",
    params: { velocity: 45, angle: 45, mass: 50, airResistance: true },
    description: "Heavy projectile with air resistance"
  },
  {
    name: "Bullet",
    icon: "🔸",
    params: { velocity: 85, angle: 25, mass: 5, airResistance: true },
    description: "High-speed, lightweight projectile"
  },
  {
    name: "Basketball",
    icon: "🏀",
    params: { velocity: 35, angle: 55, mass: 20, airResistance: true },
    description: "Sports projectile with moderate air resistance"
  },
  {
    name: "Feather",
    icon: "🪶",
    params: { velocity: 25, angle: 40, mass: 1, airResistance: true },
    description: "Very light object heavily affected by air"
  },
  {
    name: "Perfect Vacuum",
    icon: "✨",
    params: { velocity: 45, angle: 45, mass: 25, airResistance: false },
    description: "Ideal physics without air resistance"
  }
];

export function ControlPanel({
  params,
  updateParams,
  simulation,
  startSimulation,
  resetSimulation,
  togglePause,
  isDayTheme
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'presets' | 'canvas'>('params');

  const applyPreset = (preset: Preset) => {
    updateParams(preset.params);
    resetSimulation();
  };

  const cardClass = `${
    isDayTheme ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
  } rounded-xl shadow-lg border`;

  const tabButtonClass = (isActive: boolean) => `
    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
    ${isActive 
      ? (isDayTheme ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300')
      : (isDayTheme ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-700')
    }
  `;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className={cardClass}>
        <div className="p-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('params')}
              className={tabButtonClass(activeTab === 'params')}
            >
              ⚙️ Parameters
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={tabButtonClass(activeTab === 'presets')}
            >
              🎮 Presets
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={tabButtonClass(activeTab === 'canvas')}
            >
              📐 Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'params' && (
          <div className={`${cardClass} h-full`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${
                isDayTheme ? 'text-gray-900' : 'text-white'
              }`}>
                Physics Parameters
              </h3>
            </div>
            
            <div className="p-4 space-y-6 overflow-y-auto">
              <ParameterSlider
                label="Initial Velocity"
                value={params.velocity}
                min={10}
                max={100}
                step={1}
                unit="m/s"
                color="blue"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ velocity: value })}
                description="The initial speed of the projectile"
              />

              <ParameterSlider
                label="Launch Angle"
                value={params.angle}
                min={5}
                max={85}
                step={1}
                unit="°"
                color="green"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ angle: value })}
                description="The angle at which the projectile is launched"
              />

              <ParameterSlider
                label="Projectile Mass"
                value={params.mass}
                min={1}
                max={100}
                step={1}
                unit="kg"
                color="purple"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ mass: value })}
                description="The mass of the projectile (affects air resistance)"
              />

              <ParameterSlider
                label="Gravity"
                value={params.gravity}
                min={1}
                max={20}
                step={0.1}
                unit="m/s²"
                color="red"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ gravity: value })}
                description="Gravitational acceleration"
              />

              {/* Air Resistance Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${
                    isDayTheme ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Air Resistance
                  </label>
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
                <p className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                  {params.airResistance 
                    ? 'Air resistance is affecting the trajectory'
                    : 'Perfect vacuum conditions (no air resistance)'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className={`${cardClass} h-full`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${
                isDayTheme ? 'text-gray-900' : 'text-white'
              }`}>
                Quick Presets
              </h3>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <PresetSelector
                presets={PRESETS}
                onApplyPreset={applyPreset}
                isDayTheme={isDayTheme}
              />
            </div>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className={`${cardClass} h-full`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${
                isDayTheme ? 'text-gray-900' : 'text-white'
              }`}>
                Canvas Settings
              </h3>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <CanvasSizeControls
                params={params}
                updateParams={updateParams}
                isDayTheme={isDayTheme}
              />
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className={cardClass}>
        <div className="p-4">
          <ControlButtons
            simulation={simulation}
            startSimulation={startSimulation}
            resetSimulation={resetSimulation}
            togglePause={togglePause}
            isDayTheme={isDayTheme}
          />
        </div>
      </div>
    </div>
  );
}