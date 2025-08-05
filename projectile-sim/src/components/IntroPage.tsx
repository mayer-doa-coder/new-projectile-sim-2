'use client';

import { useState, useEffect } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMembers, setShowMembers] = useState(false);

  const teamMembers = [
    'Tawhidul Hasan',
    'Shormi Ghosh', 
    'Arka Braja Prasad Nath',
    'Adiba Tahsin',
    'Sarwad Hossain Siddiqui'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === 0) {
        setCurrentStep(1);
      } else if (currentStep === 1) {
        setShowMembers(true);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse -bottom-48 -right-48 animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Team Name */}
        <div className={`transition-all duration-2000 ease-out ${
          currentStep >= 0 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-8 tracking-wider">
            KUET KOBE KHULBE
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-2000 ease-out delay-1000 ${
          currentStep >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-light">
            Projectile Motion Simulation Team
          </p>
        </div>

        {/* Team Members */}
        <div className={`transition-all duration-2000 ease-out delay-2000 ${
          showMembers ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl text-white mb-8 font-semibold">
            Team Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {teamMembers.map((member, index) => (
              <div
                key={member}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 transition-all duration-1000 ease-out ${
                  showMembers ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="text-lg font-medium text-white">
                  {member}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading animation */}
        <div className={`transition-all duration-1000 ease-out ${
          currentStep >= 2 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-400"></div>
          </div>
          <p className="text-gray-300 mt-4 text-lg">Loading Simulation...</p>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
      >
        Skip Intro
      </button>
    </div>
  );
};

export default IntroPage;