'use client';

import { useState } from 'react';
import ProjectileSimulator from '@/components/ProjectileSimulator';
import IntroPage from '@/components/IntroPage';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 py-8">
      <ProjectileSimulator />
    </main>
  );
}
