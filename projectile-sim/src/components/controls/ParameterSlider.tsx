import React from 'react';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  isDayTheme: boolean;
  onChange: (value: number) => void;
  description?: string;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-400 to-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    thumb: 'border-blue-500'
  },
  green: {
    gradient: 'from-green-400 to-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    thumb: 'border-green-500'
  },
  purple: {
    gradient: 'from-purple-400 to-purple-600',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    thumb: 'border-purple-500'
  },
  red: {
    gradient: 'from-red-400 to-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    thumb: 'border-red-500'
  },
  orange: {
    gradient: 'from-orange-400 to-orange-600',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    thumb: 'border-orange-500'
  }
};

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  color,
  isDayTheme,
  onChange,
  description
}: ParameterSliderProps) {
  const colors = colorClasses[color];
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className={`text-sm font-medium ${
          isDayTheme ? 'text-gray-700' : 'text-gray-300'
        }`}>
          {label}
        </label>
        <span className={`text-sm font-mono px-3 py-1 rounded-full ${colors.badge}`}>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className={`w-full h-3 rounded-full ${
          isDayTheme ? 'bg-gray-200' : 'bg-gray-600'
        } overflow-hidden`}>
          {/* Progress */}
          <div 
            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-200`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Thumb indicator */}
        <div 
          className={`absolute top-1/2 w-5 h-5 bg-white border-2 ${colors.thumb} rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg pointer-events-none transition-all duration-200`}
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      
      {description && (
        <p className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
          {description}
        </p>
      )}
    </div>
  );
}