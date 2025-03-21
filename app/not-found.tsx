'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const [particles, setParticles] = useState<React.ReactElement[]>([]);
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    generateParticles(30);
  }, []);

  const generateParticles = (count: number) => {
    const colors = ['#4299e1', '#2d3748', '#a0aec0', '#e2e8f0'];
    const newParticles = Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 20 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      return (
        <div
          key={`${i}-${size}`}
          className="absolute rounded-full opacity-50"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            left: `${left}%`,
            bottom: `-${size}px`,
            animation: `float ${duration}s infinite linear ${delay}s`,
          }}
        />
      );
    });

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const activateEasterEgg = () => {
    setEasterEggActive(true);
    generateParticles(50);
  };

  return (
    <div className="relative flex justify-center items-center h-[100svh] bg-black text-gray-400 overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0">{particles}</div>

      <div className="text-center p-6 max-w-lg relative">
        {/* Error Code */}
        <h1 className={`text-9xl font-bold ${easterEggActive ? 'text-purple-600' : 'text-gray-300'} animate-pulse`}>
          404
        </h1>

        {/* Error Title */}
        <h2 className="text-2xl font-semibold mt-4">{easterEggActive ? 'You found a secret!' : 'Page Not Found'}</h2>

        {/* Error Message */}
        <p className="text text-gray-300 mt-2">
          {easterEggActive
            ? 'You discovered the Easter egg! Nice job exploring.'
            : "The page you're looking for doesn't exist or has been moved."}
          <br />

          <div className="mt-8 flex justify-center items-center gap-5 h-[40px]">
            <Link
              href="/"
              className="w-fit px-4 gap-2 border border-gray-300 h-full rounded-md flex items-center justify-center text-sm font-[500] hover:text-main/80 transition hover:bg-gray-300 hover:text-black"
            >
              <Home size={20} color="currentColor" />
              Go Home
            </Link>
          </div>
        </p>
      </div>

      {!easterEggActive && (
        <div
          onClick={activateEasterEgg}
          className="absolute bottom-6 right-6 w-10 h-12 bg-yellow-400 rounded-full cursor-pointer transition transform hover:scale-110 active:scale-95 shadow-lg"
          title="Click me for a surprise!"
        >
          <div className="absolute top-3 left-3 w-4 h-4 bg-white bg-opacity-60 rounded-full"></div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }

        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
