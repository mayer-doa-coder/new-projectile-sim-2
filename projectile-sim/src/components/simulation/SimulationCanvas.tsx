import React, { useRef, useEffect, useCallback, useState } from 'react';
import { CanvasProps } from '../../types/simulation';

const GROUND_HEIGHT = 100;

export function SimulationCanvas({ simulation, params, isDayTheme, updateParams }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate cannon base height based on cannon height parameter
  const CANNON_BASE_HEIGHT = Math.max(20, params.cannonHeight * 40); // Scale cannon height for visual representation

  // Calculate scale based on canvas dimensions
  const scale = Math.min(params.canvasWidth / 20, params.canvasHeight / 12.5);

  // Convert physics coordinates to canvas coordinates
  const physicsToCanvas = useCallback((x: number, y: number) => {
    return {
      x: x * scale + 100,
      y: params.canvasHeight - GROUND_HEIGHT - y * scale
    };
  }, [scale, params.canvasHeight]);



  // Check if mouse is over cannon area
  const isMouseOverCannon = useCallback((mouseX: number, mouseY: number) => {
    const cannonX = 100;
    const cannonY = params.canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10;
    const distance = Math.sqrt((mouseX - cannonX) ** 2 + (mouseY - cannonY) ** 2);
    return distance < 60; // 60px radius around cannon
  }, [params.canvasHeight, CANNON_BASE_HEIGHT]);

  // Handle mouse move for angle control and height dragging
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    setMousePos({ x: mouseX, y: mouseY });

    if (isDragging) {
      // Handle height dragging
      const cannonBaseY = params.canvasHeight - GROUND_HEIGHT;
      const newHeight = Math.max(0.1, Math.min(10, (cannonBaseY - mouseY) / 40));
      if (updateParams) {
        updateParams({ cannonHeight: parseFloat(newHeight.toFixed(2)) });
      }
    } else if (isMouseOverCannon(mouseX, mouseY)) {
      // Handle angle hovering
      const cannonX = 100;
      const cannonY = params.canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10;
      
      const deltaX = mouseX - cannonX;
      const deltaY = cannonY - mouseY;
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Constrain angle between 0 and 90 degrees
      angle = Math.max(0, Math.min(90, angle));
      
      if (updateParams) {
        updateParams({ angle: parseFloat(angle.toFixed(1)) });
      }
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  }, [isDragging, isMouseOverCannon, params.canvasHeight, CANNON_BASE_HEIGHT, updateParams]);

  // Handle mouse down for starting drag
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    if (isMouseOverCannon(mouseX, mouseY)) {
      setIsDragging(true);
    }
  }, [isMouseOverCannon]);

  // Handle mouse up for ending drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setIsHovering(false);
  }, []);

  // Draw the simulation
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = params.canvasWidth;
    canvas.height = params.canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, params.canvasWidth, params.canvasHeight);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, params.canvasHeight - GROUND_HEIGHT);
    if (isDayTheme) {
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(1, '#E0F6FF');
    } else {
      skyGradient.addColorStop(0, '#1a1a2e');
      skyGradient.addColorStop(1, '#16213e');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight - GROUND_HEIGHT);

    // Draw clouds (if day theme)
    if (isDayTheme) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      // Adjust cloud positions based on canvas size
      const cloudScale = params.canvasWidth / 800;
      
      // Cloud 1
      ctx.beginPath();
      ctx.arc(200 * cloudScale, 100, 25 * cloudScale, 0, Math.PI * 2);
      ctx.arc(230 * cloudScale, 100, 35 * cloudScale, 0, Math.PI * 2);
      ctx.arc(260 * cloudScale, 100, 25 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud 2
      ctx.beginPath();
      ctx.arc(500 * cloudScale, 80, 30 * cloudScale, 0, Math.PI * 2);
      ctx.arc(535 * cloudScale, 80, 40 * cloudScale, 0, Math.PI * 2);
      ctx.arc(570 * cloudScale, 80, 30 * cloudScale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw stars for night theme
      ctx.fillStyle = '#ffffff';
      const starCount = Math.floor((params.canvasWidth * params.canvasHeight) / 8000);
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * params.canvasWidth;
        const y = Math.random() * (params.canvasHeight - GROUND_HEIGHT);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, params.canvasHeight - GROUND_HEIGHT, 0, params.canvasHeight);
    groundGradient.addColorStop(0, '#4ade80');
    groundGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, params.canvasHeight - GROUND_HEIGHT, params.canvasWidth, GROUND_HEIGHT);

    // Draw mountains/hills (scaled to canvas)
    ctx.fillStyle = isDayTheme ? '#8b5a2b' : '#4a4a4a';
    ctx.beginPath();
    const mountainScale = params.canvasWidth / 800;
    ctx.moveTo(600 * mountainScale, params.canvasHeight - GROUND_HEIGHT);
    ctx.lineTo(650 * mountainScale, params.canvasHeight - GROUND_HEIGHT - 60);
    ctx.lineTo(700 * mountainScale, params.canvasHeight - GROUND_HEIGHT - 40);
    ctx.lineTo(750 * mountainScale, params.canvasHeight - GROUND_HEIGHT - 80);
    ctx.lineTo(params.canvasWidth, params.canvasHeight - GROUND_HEIGHT - 50);
    ctx.lineTo(params.canvasWidth, params.canvasHeight - GROUND_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Draw cannon platform with interaction highlight
    if (isHovering || isDragging) {
      ctx.fillStyle = isDragging ? '#a16207' : '#92400e';
    } else {
      ctx.fillStyle = '#8b5a2b';
    }
    ctx.fillRect(80, params.canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT, 40, CANNON_BASE_HEIGHT);

    // Calculate cannon position based on height
    const cannonY = params.canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10;
    
    // Draw cannon with interaction highlight
    ctx.save();
    ctx.translate(100, cannonY);
    ctx.rotate(-params.angle * Math.PI / 180);
    
    // Cannon barrel with interaction highlight
    if (isHovering || isDragging) {
      ctx.fillStyle = isDragging ? '#2563eb' : '#3b82f6';
    } else {
      ctx.fillStyle = '#4a5568';
    }
    ctx.fillRect(0, -6, 50, 12);
    
    // Cannon wheel
    ctx.restore();
    ctx.fillStyle = '#2d3748';
    const wheelY = cannonY + 25;
    ctx.beginPath();
    ctx.arc(90, wheelY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Cannon wheel spokes
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(90, wheelY);
      const angle = (i * Math.PI) / 4;
      ctx.lineTo(90 + Math.cos(angle) * 12, wheelY + Math.sin(angle) * 12);
      ctx.stroke();
    }

    // Draw interaction indicators
    if (isHovering || isDragging) {
      // Draw angle indicator line
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(100, cannonY);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw angle arc
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(100, cannonY, 30, 0, -params.angle * Math.PI / 180, true);
      ctx.stroke();

      // Draw angle text
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.font = '12px Arial';
      ctx.fillText(`${params.angle.toFixed(1)}°`, 110, cannonY - 35);

      // Draw height indicator
      if (isDragging) {
        ctx.strokeStyle = 'rgba(161, 98, 7, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(60, params.canvasHeight - GROUND_HEIGHT);
        ctx.lineTo(60, params.canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw height text
        ctx.fillStyle = 'rgba(161, 98, 7, 0.9)';
        ctx.font = '12px Arial';
        ctx.fillText(`${params.cannonHeight.toFixed(1)}m`, 15, cannonY);
      }
    }

    // Draw trajectory
    if (simulation.trajectory.length > 1) {
      ctx.strokeStyle = params.airResistance ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
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
      ctx.ellipse(pos.x, params.canvasHeight - GROUND_HEIGHT + 5, 8, 3, 0, 0, Math.PI * 2);
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
        const vectorScale = 3;
        const endX = pos.x + simulation.currentProjectile.vx * vectorScale;
        const endY = pos.y - simulation.currentProjectile.vy * vectorScale;
        
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

    // Draw target (scaled to canvas)
    const targetX = params.canvasWidth * 0.9;
    const targetY = params.canvasHeight - GROUND_HEIGHT - 20;
    
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

  }, [simulation, params, isDayTheme, physicsToCanvas, CANNON_BASE_HEIGHT, isDragging, isHovering, mousePos]);

  // Effect for drawing
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={params.canvasWidth}
        height={params.canvasHeight}
        className="rounded-lg border-2 border-gray-300 shadow-lg bg-gradient-to-b from-blue-400 to-blue-500 max-w-full h-auto"
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: `${params.canvasWidth} / ${params.canvasHeight}`,
          cursor: isDragging ? 'grabbing' : (isHovering ? 'grab' : 'default')
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Canvas size indicator */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono ${
        isDayTheme ? 'bg-black/20 text-white' : 'bg-white/20 text-white'
      }`}>
        {params.canvasWidth} × {params.canvasHeight}
      </div>

      {/* Interactive controls instruction */}
      <div className={`absolute bottom-2 left-2 px-3 py-2 rounded-lg text-xs ${
        isDayTheme ? 'bg-white/90 text-gray-800 shadow-md' : 'bg-gray-800/90 text-white shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-500">🖱️</span>
          <span className="font-semibold">Interactive Cannon Controls:</span>
        </div>
        <div className="text-xs opacity-80">
          • Hover over cannon to adjust angle
        </div>
        <div className="text-xs opacity-80">
          • Click & drag cannon to change height
        </div>
      </div>

      {/* Current interaction feedback */}
      {(isHovering || isDragging) && (
        <div className={`absolute top-2 left-2 px-3 py-2 rounded-lg text-sm font-medium ${
          isDayTheme ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-blue-900/80 text-blue-100 border border-blue-700'
        }`}>
          {isDragging && (
            <div className="flex items-center gap-2">
              <span className="text-amber-500">📏</span>
              <span>Height: {params.cannonHeight.toFixed(1)}m</span>
            </div>
          )}
          {isHovering && !isDragging && (
            <div className="flex items-center gap-2">
              <span className="text-blue-500">📐</span>
              <span>Angle: {params.angle.toFixed(1)}°</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}