import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

// Sidebar Component (Fallback jika import gagal)
const SidebarFallback = () => {
  return (
    <aside className="w-48 bg-purple-800/50 backdrop-blur-sm border-r border-purple-600/30 p-4 hidden lg:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">dicoding</h2>
      </div>
      <nav className="space-y-2">
        <div className="px-4 py-2 bg-purple-700/50 rounded-lg">
          <span className="text-white font-medium">BELAJAR</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PAPAN SKOR</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PROFILE</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">PENGATURAN</span>
        </div>
        <div className="px-4 py-2 hover:bg-purple-700/30 rounded-lg cursor-pointer">
          <span className="text-purple-200">KELUAR</span>
        </div>
      </nav>
    </aside>
  );
};

// Module Card Component
const ModuleCard = ({ letter, status, hasImage = false }) => {
  const isCompleted = status === 'Completed';
  
  return (
    <div className="bg-gradient-to-br from-purple-600/40 to-purple-800/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:transform hover:scale-105">
      {/* Hand Image */}
      <div className="mb-4 flex justify-center">
        {hasImage ? (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              {/* Stylized hand representation */}
              <path d="M30 70 L30 45 Q30 40 35 40 Q40 40 40 45 L40 35 Q40 30 45 30 Q50 30 50 35 L50 25 Q50 20 55 20 Q60 20 60 25 L60 30 L65 30 Q70 30 70 35 L70 60 Q70 75 55 75 L35 75 Q30 75 30 70 Z" 
                    fill="url(#handGradient)" 
                    className="drop-shadow-sm"/>
              <defs>
                <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <path d="M30 70 L30 45 Q30 40 35 40 Q40 40 40 45 L40 35 Q40 30 45 30 Q50 30 50 35 L50 25 Q50 20 55 20 Q60 20 60 25 L60 30 L65 30 Q70 30 70 35 L70 60 Q70 75 55 75 L35 75 Q30 75 30 70 Z" 
                    fill="#ff9a9e" 
                    className="drop-shadow-sm"/>
            </svg>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-purple-900/50 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-400 to-green-500 w-full' 
                : 'bg-gradient-to-r from-purple-400 to-purple-500 w-1/4'
            }`}
          />
        </div>
      </div>
      
      {/* Status and Letter */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${
          isCompleted ? 'text-green-300' : 'text-purple-300'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{letter}</span>
        <button className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-110 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function ModulePage() {
  const navigate = useNavigate();
  
  const moduleItems = [
    { id: 1, letter: 'A', status: 'Completed', hasImage: true },
    { id: 2, letter: 'B', status: 'Not Completed' },
    { id: 3, letter: 'C', status: 'Not Completed' },
    { id: 4, letter: 'D', status: 'Not Completed' },
    { id: 5, letter: 'E', status: 'Not Completed' },
    { id: 6, letter: 'F', status: 'Not Completed' },
    { id: 7, letter: 'G', status: 'Not Completed' },
    { id: 8, letter: 'H', status: 'Not Completed' },
    { id: 9, letter: 'I', status: 'Not Completed' },
    { id: 10, letter: 'J', status: 'Not Completed' },
  ];

  const handleBackClick = () => {
    navigate('/belajar');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-blue-200 hover:text-white transition-colors mr-6 bg-purple-800/30 px-4 py-2 rounded-lg hover:bg-purple-700/30"
            aria-label="Kembali ke halaman belajar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Kembali
          </button>
        </div>

        {/* Module Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Modul Pertama: A sampai J
          </h1>
        </header>

        {/* Module Grid */}
        <div className="max-w-6xl mx-auto">
          {/* First Row: A-E */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
            {moduleItems.slice(0, 5).map((item) => (
              <ModuleCard 
                key={item.id}
                letter={item.letter}
                status={item.status}
                hasImage={item.hasImage}
              />
            ))}
          </div>
          
          {/* Second Row: F-J */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {moduleItems.slice(5).map((item) => (
              <ModuleCard 
                key={item.id}
                letter={item.letter}
                status={item.status}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}