import React from 'react';
import { DataPanelProps } from '../../types/simulation';

export function DataPanel({ simulation, params, isDayTheme }: DataPanelProps) {
  const cardClass = `${
    isDayTheme ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
  } rounded-xl shadow-lg border`;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Real-time Data */}
      <div className={cardClass}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${
            isDayTheme ? 'text-gray-900' : 'text-white'
          }`}>
            Live Data
          </h3>
        </div>
        
        <div className="p-4">
          {simulation.currentProjectile ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${
                isDayTheme ? 'bg-blue-50' : 'bg-blue-900/20'
              }`}>
                <div className={`text-xs font-medium ${
                  isDayTheme ? 'text-blue-700' : 'text-blue-300'
                } mb-1`}>
                  Position
                </div>
                <div className={`text-sm font-mono ${
                  isDayTheme ? 'text-blue-900' : 'text-blue-100'
                }`}>
                  X: {simulation.currentProjectile.x.toFixed(1)}m<br/>
                  Y: {simulation.currentProjectile.y.toFixed(1)}m
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                isDayTheme ? 'bg-green-50' : 'bg-green-900/20'
              }`}>
                <div className={`text-xs font-medium ${
                  isDayTheme ? 'text-green-700' : 'text-green-300'
                } mb-1`}>
                  Velocity
                </div>
                <div className={`text-sm font-mono ${
                  isDayTheme ? 'text-green-900' : 'text-green-100'
                }`}>
                  Vₓ: {simulation.currentProjectile.vx.toFixed(1)}m/s<br/>
                  Vᵧ: {simulation.currentProjectile.vy.toFixed(1)}m/s
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                isDayTheme ? 'bg-purple-50' : 'bg-purple-900/20'
              }`}>
                <div className={`text-xs font-medium ${
                  isDayTheme ? 'text-purple-700' : 'text-purple-300'
                } mb-1`}>
                  Speed & Time
                </div>
                <div className={`text-sm font-mono ${
                  isDayTheme ? 'text-purple-900' : 'text-purple-100'
                }`}>
                  Speed: {Math.sqrt(simulation.currentProjectile.vx ** 2 + simulation.currentProjectile.vy ** 2).toFixed(1)} m/s<br/>
                  Time: {simulation.currentProjectile.time.toFixed(2)}s
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${
              isDayTheme ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-sm">Press start to begin simulation</div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {simulation.isRunning && (
        <div className={cardClass}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold ${
              isDayTheme ? 'text-gray-900' : 'text-white'
            }`}>
               Progress
            </h3>
          </div>
          
          <div className="p-4">
            <div className={`w-full h-4 rounded-full ${
              isDayTheme ? 'bg-gray-200' : 'bg-gray-600'
            } overflow-hidden mb-2`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-100 ease-out"
                style={{ width: `${simulation.animationProgress * 100}%` }}
              />
            </div>
            
            <div className={`text-center text-sm ${
              isDayTheme ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {(simulation.animationProgress * 100).toFixed(1)}% Complete
            </div>
          </div>
        </div>
      )}

      {/* Physics Info */}
      <div className={`${cardClass} flex-1`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${
            isDayTheme ? 'text-gray-900' : 'text-white'
          }`}>
            Physics Info
          </h3>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Current Parameters */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${
              isDayTheme ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Current Parameters
            </h4>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Initial Velocity:</span>
                <span className="font-mono">{params.velocity} m/s</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Launch Angle:</span>
                <span className="font-mono">{params.angle}°</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Projectile Mass:</span>
                <span className="font-mono">{params.mass} kg</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Gravity:</span>
                <span className="font-mono">{params.gravity} m/s²</span>
              </div>
            </div>
          </div>

          {/* Calculated Results */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${
              isDayTheme ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Calculated Results
            </h4>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Maximum Height:</span>
                <span className="font-mono">{simulation.maxHeight.toFixed(2)} m</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Range:</span>
                <span className="font-mono">{simulation.range.toFixed(2)} m</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <span>Time of Flight:</span>
                <span className="font-mono">{simulation.timeOfFlight.toFixed(2)} s</span>
              </div>
            </div>
          </div>

          {/* Physics Model */}
          <div className={`border-t pt-3 ${
            isDayTheme ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              isDayTheme ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Physics Model
            </h4>
            <div className={`text-xs ${
              isDayTheme ? 'text-gray-500' : 'text-gray-400'
            } space-y-1`}>
              <div className="font-medium">
                {params.airResistance ? ' With Air Resistance' : 'Ideal Conditions (Vacuum)'}
              </div>
              <div>
                {params.airResistance 
                  ? 'Trajectory affected by drag force proportional to velocity² and inversely proportional to mass'
                  : 'Perfect parabolic trajectory following kinematic equations: x = v₀cos(θ)t, y = v₀sin(θ)t - ½gt²'
                }
              </div>
            </div>
          </div>

          {/* Canvas Info */}
          <div className={`border-t pt-3 ${
            isDayTheme ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              isDayTheme ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Canvas Settings
            </h4>
            <div className="space-y-1 text-xs">
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <span>Dimensions:</span>
                <span className="font-mono">{params.canvasWidth} × {params.canvasHeight}px</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <span>Aspect Ratio:</span>
                <span className="font-mono">{(params.canvasWidth / params.canvasHeight).toFixed(2)}:1</span>
              </div>
              <div className={`flex justify-between ${
                isDayTheme ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <span>Scale:</span>
                <span className="font-mono">{Math.min(params.canvasWidth / 20, params.canvasHeight / 12.5).toFixed(1)}px/m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}