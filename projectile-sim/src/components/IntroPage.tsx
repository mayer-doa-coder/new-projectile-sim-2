'use client';

import { useState, useEffect, useRef } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showTeamName, setShowTeamName] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const teamMembers = [
    'Tawhidul Hasan',
    'Arka Braja Prasad Nath', 
    'Sarwad Hossain Siddiqui',
    'Adiba Tahsin',
    'Shormi Ghosh'
  ];

  // Initialize floating magical elements
  useEffect(() => {
    const elements = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3000
    }));
    setFloatingElements(elements);
  }, []);

  // Animated timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowTitle(true), 500),
      setTimeout(() => setShowTeamName(true), 2000),
      setTimeout(() => setShowMembers(true), 3500),
      setTimeout(() => setCurrentPhase(1), 8000), // Auto transition after 8 seconds
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Canvas animation for magical particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 180 // Blue to green range for Ghibli feel
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Ghibli-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-sky-300 to-indigo-400 opacity-90" />
      
      {/* Floating magical elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}ms`,
              animationDuration: `${4000 + Math.random() * 2000}ms`
            }}
          />
        ))}
      </div>

      {/* Cloud-like decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-16 bg-white/30 rounded-full blur-sm animate-bounce-slow" />
      <div className="absolute top-40 right-20 w-24 h-12 bg-white/20 rounded-full blur-sm animate-bounce-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-28 h-14 bg-white/25 rounded-full blur-sm animate-bounce-slow" style={{ animationDelay: '2s' }} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        
        {/* Main Title with magical entrance */}
        <div className={`transition-all duration-2000 ease-out transform ${
          showTitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 drop-shadow-lg">
              Projectile Motion
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 drop-shadow-lg">
              Simulator
            </span>
                         {/* Magical sparkle effect */}
             <div className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-sparkle">✨</div>
             <div className="absolute -bottom-2 -left-4 w-6 h-6 text-yellow-300 animate-sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
             <div className="absolute top-1/2 -left-8 w-4 h-4 text-pink-300 animate-sparkle" style={{ animationDelay: '1s' }}>💫</div>
             <div className="absolute -top-2 left-1/4 w-5 h-5 text-blue-300 animate-sparkle" style={{ animationDelay: '1.5s' }}>✦</div>
          </h1>
        </div>

        {/* Team Name with floating animation */}
                 <div className={`transition-all duration-2000 ease-out transform ${
           showTeamName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
         }`} style={{ transitionDelay: '0.5s' }}>
           <div className="relative bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl mb-8 hover:scale-105 transition-transform duration-500 animate-magical-glow">
             <p className="text-sm md:text-lg text-emerald-800 font-medium mb-2">Presented by</p>
             <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-700">
               KUET KOBE KHULBE
             </h2>
             {/* Floating magical elements around team name */}
             <div className="absolute -top-2 -right-2 w-6 h-6 text-emerald-400 animate-gentle-drift">🌟</div>
             <div className="absolute -bottom-2 -left-2 w-5 h-5 text-blue-400 animate-gentle-drift" style={{ animationDelay: '2s' }}>✨</div>
             <div className="absolute top-1/2 -right-4 w-4 h-4 text-purple-400 animate-gentle-drift" style={{ animationDelay: '4s' }}>💎</div>
           </div>
         </div>

        {/* Team Members with staggered animation */}
        <div className={`transition-all duration-1500 ease-out transform ${
          showMembers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-6">Team Members</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={member}
                className={`bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 transform ${
                  showMembers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${1000 + index * 200}ms`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)`
                }}
              >
                <div className="text-lg md:text-xl font-medium text-slate-800 mb-2">
                  {member}
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-60" />
              </div>
            ))}
          </div>
        </div>

        {/* Magical loading indicator */}
        <div className={`mt-12 transition-all duration-1000 ease-out ${
          showMembers ? 'opacity-100' : 'opacity-0'
        }`} style={{ transitionDelay: '2s' }}>
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-slate-700 text-lg font-medium">
            {currentPhase === 0 ? 'Preparing magical simulation...' : 'Loading complete!'}
          </p>
        </div>

      </div>

      {/* Interactive Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 group px-8 py-4 bg-white/20 backdrop-blur-md text-slate-800 rounded-full border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="flex items-center space-x-2">
          <span>Skip Intro</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </button>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-white/30 rounded-tl-2xl" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-white/30 rounded-tr-2xl" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white/30 rounded-bl-2xl" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-white/30 rounded-br-2xl opacity-50" />
    </div>
  );
};

export default IntroPage;