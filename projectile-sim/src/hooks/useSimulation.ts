import { useState, useCallback, useRef, useEffect } from 'react';
import { SimulationParams, SimulationState, ProjectileData } from '../types/simulation';

const AIR_RESISTANCE_COEFFICIENT = 0.05;

export function useSimulation(params: SimulationParams) {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  
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

  return {
    simulation,
    startSimulation,
    resetSimulation,
    togglePause
  };
}