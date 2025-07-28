'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ProjectileData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
}

interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  trajectory: ProjectileData[];
  currentProjectile: ProjectileData | null;
  maxHeight: number;
  range: number;
  timeOfFlight: number;
  animationProgress: number;
}

interface SimulationParams {
  velocity: number;
  angle: number;
  mass: number;
  airResistance: boolean;
  gravity: number;
}

interface Preset {
  name: string;
  icon: string;
  params: Partial<SimulationParams>;
  description: string;
}

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

export default function ProjectileSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  
  const [params, setParams] = useState<SimulationParams>({
    velocity: 45,
    angle: 45,
    mass: 25,
    airResistance: true,
    gravity: 9.81
  });

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    isPaused: false,
    trajectory: [],
    currentProjectile: null,
    maxHeight: 0,
    range: 0,
    timeOfFlight: 0,
    animationProgress: 0
  });

  const [isDayTheme, setIsDayTheme] = useState(true);

  // Physics constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const GROUND_HEIGHT = 100;
  const SCALE = 40; // pixels per meter
  const AIR_RESISTANCE_COEFFICIENT = 0.05;
  const CANNON_BASE_HEIGHT = 60;

  // Convert physics coordinates to canvas coordinates
  const physicsToCanvas = useCallback((x: number, y: number) => {
    return {
      x: x * SCALE + 100,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - y * SCALE
    };
  }, []);

  // Calculate projectile motion with or without air resistance
  const calculateTrajectory = useCallback((params: SimulationParams): ProjectileData[] => {
    const { velocity, angle, mass, airResistance, gravity } = params;
    const angleRad = (angle * Math.PI) / 180;
    const vx0 = velocity * Math.cos(angleRad);
    const vy0 = velocity * Math.sin(angleRad);
    
    const trajectory: ProjectileData[] = [];
    const dt = 0.016; // 60fps
    let t = 0;
    let x = 0;
    let y = 1.5; // Start from cannon height
    let vx = vx0;
    let vy = vy0;

    while (y >= 0 || t === 0) {
      trajectory.push({ x, y, vx, vy, time: t });

      if (airResistance) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        const dragCoeff = AIR_RESISTANCE_COEFFICIENT / mass;
        const dragForceX = -dragCoeff * speed * vx;
        const dragForceY = -dragCoeff * speed * vy;
        
        vx += dragForceX * dt;
        vy += (dragForceY - gravity) * dt;
      } else {
        vy -= gravity * dt;
      }

      x += vx * dt;
      y += vy * dt;
      t += dt;

      if (t > 15) break; // Safety limit
    }

    return trajectory;
  }, []);

  // Calculate simulation results
  const calculateResults = useCallback((trajectory: ProjectileData[]) => {
    if (trajectory.length === 0) return { maxHeight: 0, range: 0, timeOfFlight: 0 };

    const maxHeight = Math.max(...trajectory.map(p => p.y));
    const lastPoint = trajectory[trajectory.length - 1];
    const range = lastPoint.x;
    const timeOfFlight = lastPoint.time;

    return { maxHeight, range, timeOfFlight };
  }, []);

  // Draw the simulation
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT - GROUND_HEIGHT);
    if (isDayTheme) {
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(1, '#E0F6FF');
    } else {
      skyGradient.addColorStop(0, '#1a1a2e');
      skyGradient.addColorStop(1, '#16213e');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);

    // Draw clouds (if day theme)
    if (isDayTheme) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      // Cloud 1
      ctx.beginPath();
      ctx.arc(200, 100, 25, 0, Math.PI * 2);
      ctx.arc(230, 100, 35, 0, Math.PI * 2);
      ctx.arc(260, 100, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud 2
      ctx.beginPath();
      ctx.arc(500, 80, 30, 0, Math.PI * 2);
      ctx.arc(535, 80, 40, 0, Math.PI * 2);
      ctx.arc(570, 80, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw stars for night theme
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * (CANVAS_HEIGHT - GROUND_HEIGHT);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - GROUND_HEIGHT, 0, CANVAS_HEIGHT);
    groundGradient.addColorStop(0, '#4ade80');
    groundGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

    // Draw mountains/hills
    ctx.fillStyle = isDayTheme ? '#8b5a2b' : '#4a4a4a';
    ctx.beginPath();
    ctx.moveTo(600, CANVAS_HEIGHT - GROUND_HEIGHT);
    ctx.lineTo(650, CANVAS_HEIGHT - GROUND_HEIGHT - 60);
    ctx.lineTo(700, CANVAS_HEIGHT - GROUND_HEIGHT - 40);
    ctx.lineTo(750, CANVAS_HEIGHT - GROUND_HEIGHT - 80);
    ctx.lineTo(800, CANVAS_HEIGHT - GROUND_HEIGHT - 50);
    ctx.lineTo(800, CANVAS_HEIGHT - GROUND_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Draw cannon platform
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(80, CANVAS_HEIGHT - GROUND_HEIGHT - CANNON_BASE_HEIGHT, 40, CANNON_BASE_HEIGHT);

    // Draw cannon
    ctx.save();
    ctx.translate(100, CANVAS_HEIGHT - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10);
    ctx.rotate(-params.angle * Math.PI / 180);
    
    // Cannon barrel
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, -6, 50, 12);
    
    // Cannon wheel
    ctx.restore();
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.arc(90, CANVAS_HEIGHT - GROUND_HEIGHT - 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Cannon wheel spokes
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(90, CANVAS_HEIGHT - GROUND_HEIGHT - 15);
      const angle = (i * Math.PI) / 4;
      ctx.lineTo(90 + Math.cos(angle) * 12, CANVAS_HEIGHT - GROUND_HEIGHT - 15 + Math.sin(angle) * 12);
      ctx.stroke();
    }

    // Draw trajectory
    if (simulation.trajectory.length > 1) {
      ctx.strokeStyle = params.airResistance ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.lineDash = [];
      ctx.beginPath();
      
      const firstPoint = physicsToCanvas(simulation.trajectory[0].x, simulation.trajectory[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < simulation.trajectory.length; i++) {
        const point = physicsToCanvas(simulation.trajectory[i].x, simulation.trajectory[i].y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // Draw trajectory points
      ctx.fillStyle = params.airResistance ? '#ef4444' : '#3b82f6';
      for (let i = 0; i < simulation.trajectory.length; i += 20) {
        const point = physicsToCanvas(simulation.trajectory[i].x, simulation.trajectory[i].y);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw current projectile
    if (simulation.currentProjectile) {
      const pos = physicsToCanvas(simulation.currentProjectile.x, simulation.currentProjectile.y);
      
      // Projectile shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(pos.x, CANVAS_HEIGHT - GROUND_HEIGHT + 5, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Projectile
      const gradient = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 0, pos.x, pos.y, 8);
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Projectile glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Velocity vector
      if (simulation.currentProjectile.vx !== 0 || simulation.currentProjectile.vy !== 0) {
        const scale = 3;
        const endX = pos.x + simulation.currentProjectile.vx * scale;
        const endY = pos.y - simulation.currentProjectile.vy * scale;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Arrowhead
        const headlen = 8;
        const angle = Math.atan2(endY - pos.y, endX - pos.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }
    }

    // Draw target
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(720, CANVAS_HEIGHT - GROUND_HEIGHT - 20, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(720, CANVAS_HEIGHT - GROUND_HEIGHT - 20, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(720, CANVAS_HEIGHT - GROUND_HEIGHT - 20, 3, 0, Math.PI * 2);
    ctx.fill();

  }, [simulation, params, isDayTheme, physicsToCanvas]);

  // Animation function
  const animate = useCallback((currentTime: number) => {
    if (!simulation.isRunning || simulation.isPaused) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = currentTime;
    }

    const elapsed = (currentTime - startTimeRef.current) / 1000;
    const progress = Math.min(elapsed / simulation.timeOfFlight, 1);

    if (progress >= 1) {
      setSimulation(prev => ({
        ...prev,
        isRunning: false,
        animationProgress: 1,
        currentProjectile: simulation.trajectory[simulation.trajectory.length - 1] || null
      }));
      return;
    }

    const trajectoryIndex = Math.floor(progress * (simulation.trajectory.length - 1));
    const currentProjectile = simulation.trajectory[trajectoryIndex] || null;

    setSimulation(prev => ({
      ...prev,
      animationProgress: progress,
      currentProjectile
    }));

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [simulation.isRunning, simulation.isPaused, simulation.timeOfFlight, simulation.trajectory]);

  // Start simulation
  const startSimulation = useCallback(() => {
    const trajectory = calculateTrajectory(params);
    const results = calculateResults(trajectory);
    
    setSimulation({
      isRunning: true,
      isPaused: false,
      trajectory,
      currentProjectile: trajectory[0] || null,
      maxHeight: results.maxHeight,
      range: results.range,
      timeOfFlight: results.timeOfFlight,
      animationProgress: 0
    });

    startTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [params, calculateTrajectory, calculateResults, animate]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setSimulation({
      isRunning: false,
      isPaused: false,
      trajectory: [],
      currentProjectile: null,
      maxHeight: 0,
      range: 0,
      timeOfFlight: 0,
      animationProgress: 0
    });
    
    startTimeRef.current = 0;
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setSimulation(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
    
    if (simulation.isPaused && animationFrameRef.current) {
      startTimeRef.current = performance.now() - (simulation.animationProgress * simulation.timeOfFlight * 1000);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [simulation.isPaused, simulation.animationProgress, simulation.timeOfFlight, animate]);

  // Apply preset
  const applyPreset = useCallback((preset: Preset) => {
    setParams(prev => ({ ...prev, ...preset.params }));
    setShowPresets(false);
    resetSimulation();
  }, [resetSimulation]);

  // Effect for animation
  useEffect(() => {
    if (simulation.isRunning && !simulation.isPaused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simulation.isRunning, simulation.isPaused, animate]);

  // Effect for drawing
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDayTheme ? 'bg-gradient-to-br from-blue-50 to-green-50' : 'bg-gradient-to-br from-gray-900 to-blue-900'}`}>
      {/* Header */}
      <div className={`${isDayTheme ? 'bg-white/90 backdrop-blur-sm' : 'bg-gray-800/90 backdrop-blur-sm'} border-b ${isDayTheme ? 'border-gray-200' : 'border-gray-700'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className={`text-2xl font-bold ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                🎯 Projectile Motion Simulator
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className={`px-3 py-1 rounded-full ${isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'}`}>
                  Max Height: {simulation.maxHeight.toFixed(1)}m
                </div>
                <div className={`px-3 py-1 rounded-full ${isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'}`}>
                  Range: {simulation.range.toFixed(1)}m
                </div>
                <div className={`px-3 py-1 rounded-full ${isDayTheme ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200'}`}>
                  Time: {simulation.timeOfFlight.toFixed(1)}s
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
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

              {/* Air Resistance Toggle */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                  Air Resistance
                </span>
                <button
                  onClick={() => setParams(prev => ({ ...prev, airResistance: !prev.airResistance }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    params.airResistance ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    params.airResistance ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className={`lg:col-span-1 space-y-6`}>
            {/* Presets */}
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                🎮 Presets
              </h3>
              <div className="space-y-2">
                {PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    onMouseEnter={() => setShowTooltip(preset.name)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 relative ${
                      isDayTheme 
                        ? 'bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-gray-900' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    } border ${isDayTheme ? 'border-gray-200' : 'border-gray-600'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{preset.icon}</span>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                ⚙️ Parameters
              </h3>
              
              <div className="space-y-6">
                {/* Velocity */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                      Velocity
                    </label>
                    <span className={`text-sm font-mono px-2 py-1 rounded ${isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'}`}>
                      {params.velocity} m/s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={params.velocity}
                    onChange={(e) => setParams(prev => ({ ...prev, velocity: Number(e.target.value) }))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600"
                  />
                </div>

                {/* Angle */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                      Launch Angle
                    </label>
                    <span className={`text-sm font-mono px-2 py-1 rounded ${isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'}`}>
                      {params.angle}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="85"
                    value={params.angle}
                    onChange={(e) => setParams(prev => ({ ...prev, angle: Number(e.target.value) }))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-green-600"
                  />
                </div>

                {/* Mass */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                      Mass
                    </label>
                    <span className={`text-sm font-mono px-2 py-1 rounded ${isDayTheme ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200'}`}>
                      {params.mass} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={params.mass}
                    onChange={(e) => setParams(prev => ({ ...prev, mass: Number(e.target.value) }))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-purple-400 to-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                🎮 Controls
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={startSimulation}
                  disabled={simulation.isRunning && !simulation.isPaused}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span className="text-2xl mb-1">▶️</span>
                  <span className="text-xs font-medium">Start</span>
                </button>
                
                <button
                  onClick={togglePause}
                  disabled={!simulation.isRunning}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span className="text-2xl mb-1">{simulation.isPaused ? '▶️' : '⏸️'}</span>
                  <span className="text-xs font-medium">{simulation.isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span className="text-2xl mb-1">🔄</span>
                  <span className="text-xs font-medium">Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Simulation Canvas */}
          <div className={`lg:col-span-2`}>
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                  🚀 Simulation
                </h3>
                <div className="flex items-center space-x-2">
                  {simulation.isRunning && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      simulation.isPaused 
                        ? (isDayTheme ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200')
                        : (isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200')
                    }`}>
                      {simulation.isPaused ? '⏸️ Paused' : '▶️ Running'}
                    </div>
                  )}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    params.airResistance 
                      ? (isDayTheme ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200')
                      : (isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200')
                  }`}>
                    {params.airResistance ? '💨 Air Resistance' : '✨ Vacuum'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="rounded-lg border-2 border-gray-300 shadow-lg bg-gradient-to-b from-blue-400 to-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Data & Analysis */}
          <div className={`lg:col-span-1 space-y-6`}>
            {/* Real-time Data */}
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                📊 Live Data
              </h3>
              
              {simulation.currentProjectile ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${isDayTheme ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                    <div className={`text-xs font-medium ${isDayTheme ? 'text-blue-700' : 'text-blue-300'} mb-1`}>Position</div>
                    <div className={`text-sm font-mono ${isDayTheme ? 'text-blue-900' : 'text-blue-100'}`}>
                      X: {simulation.currentProjectile.x.toFixed(1)}m<br/>
                      Y: {simulation.currentProjectile.y.toFixed(1)}m
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDayTheme ? 'bg-green-50' : 'bg-green-900/20'}`}>
                    <div className={`text-xs font-medium ${isDayTheme ? 'text-green-700' : 'text-green-300'} mb-1`}>Velocity</div>
                    <div className={`text-sm font-mono ${isDayTheme ? 'text-green-900' : 'text-green-100'}`}>
                      Vₓ: {simulation.currentProjectile.vx.toFixed(1)}m/s<br/>
                      Vᵧ: {simulation.currentProjectile.vy.toFixed(1)}m/s
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDayTheme ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                    <div className={`text-xs font-medium ${isDayTheme ? 'text-purple-700' : 'text-purple-300'} mb-1`}>Speed</div>
                    <div className={`text-sm font-mono ${isDayTheme ? 'text-purple-900' : 'text-purple-100'}`}>
                      {Math.sqrt(simulation.currentProjectile.vx ** 2 + simulation.currentProjectile.vy ** 2).toFixed(1)} m/s
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDayTheme ? 'bg-orange-50' : 'bg-orange-900/20'}`}>
                    <div className={`text-xs font-medium ${isDayTheme ? 'text-orange-700' : 'text-orange-300'} mb-1`}>Time</div>
                    <div className={`text-sm font-mono ${isDayTheme ? 'text-orange-900' : 'text-orange-100'}`}>
                      {simulation.currentProjectile.time.toFixed(2)}s
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-sm">Press start to begin simulation</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {simulation.isRunning && (
              <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                  ⏱️ Progress
                </h3>
                
                <div className={`w-full h-4 rounded-full ${isDayTheme ? 'bg-gray-200' : 'bg-gray-600'} overflow-hidden`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-100 ease-out"
                    style={{ width: `${simulation.animationProgress * 100}%` }}
                  />
                </div>
                
                <div className={`mt-2 text-center text-sm ${isDayTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                  {(simulation.animationProgress * 100).toFixed(1)}% Complete
                </div>
              </div>
            )}

            {/* Physics Info */}
            <div className={`${isDayTheme ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-lg p-6 border ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
                🔬 Physics Info
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                  <span>Gravity:</span>
                  <span className="font-mono">{params.gravity} m/s²</span>
                </div>
                
                <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                  <span>Initial Velocity:</span>
                  <span className="font-mono">{params.velocity} m/s</span>
                </div>
                
                <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                  <span>Launch Angle:</span>
                  <span className="font-mono">{params.angle}°</span>
                </div>
                
                <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                  <span>Projectile Mass:</span>
                  <span className="font-mono">{params.mass} kg</span>
                </div>
                
                <div className={`border-t pt-3 mt-3 ${isDayTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                  <div className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'} mb-2`}>
                    {params.airResistance ? 'With Air Resistance' : 'Ideal Conditions (No Air)'}
                  </div>
                  <div className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                    {params.airResistance 
                      ? 'Trajectory affected by drag force proportional to velocity²'
                      : 'Perfect parabolic trajectory following kinematic equations'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-black text-white text-sm rounded-lg shadow-lg">
          {showTooltip}
        </div>
      )}

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}