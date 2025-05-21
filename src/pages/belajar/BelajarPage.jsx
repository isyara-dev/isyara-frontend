import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function BelajarPage() {
  const [activeGroup, setActiveGroup] = useState(null);
  
  const alphabetGroups = [
    { 
      range: 'A - I', 
      letters: 'A, B, C, D, E, F, G, H, I',
      completed: '14/24'
    },
    { 
      range: 'J - R', 
      letters: 'J, K, L, M, N, O, P, Q, R',
      completed: '12/18' 
    },
    { 
      range: 'S - Z', 
      letters: 'S, T, U, V, W, X, Y, Z',
      completed: '10/16' 
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-100">Belajar</span>
        </div>

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Belajar Rangkai Kata</h1>
          <p className="text-lg text-blue-200">Pilih kelompok huruf dan mulai tantangan!</p>
        </header>
        
        {/* Alphabet Groups Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* First alphabet group */}
          <div 
            className={`bg-blue-800 rounded-lg p-4 cursor-pointer transition-all ${activeGroup === 0 ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActiveGroup(0)}
          >
            <h3 className="text-xl font-bold mb-3 text-center">A - I</h3>
            <p className="text-sm text-blue-300 mb-2">{alphabetGroups[0].letters}</p>
            <div className="bg-blue-700 h-2 rounded-full mb-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">Completed</span>
              <div className="flex items-center">
                <span className="text-xl font-bold mr-3">{alphabetGroups[0].completed}</span>
                <button className="bg-black hover:bg-gray-800 rounded w-8 h-8 flex items-center justify-center">
                  <span className="text-white">▶</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Second alphabet group */}
          <div 
            className={`bg-blue-800 rounded-lg p-4 cursor-pointer transition-all ${activeGroup === 1 ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActiveGroup(1)}
          >
            <h3 className="text-xl font-bold mb-3 text-center">J - R</h3>
            <p className="text-sm text-blue-300 mb-2">{alphabetGroups[1].letters}</p>
            <div className="bg-blue-700 h-2 rounded-full mb-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">Completed</span>
              <div className="flex items-center">
                <span className="text-xl font-bold mr-3">{alphabetGroups[1].completed}</span>
                <button className="bg-black hover:bg-gray-800 rounded w-8 h-8 flex items-center justify-center">
                  <span className="text-white">▶</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Challenge Section */}
          <div className="bg-blue-800 rounded-lg p-4 row-span-2">
            <h3 className="text-xl font-bold mb-3 text-center">BELAJAR RANGKAI KATA</h3>
            <p className="text-blue-300 text-center mb-8">Rangkai kata dan dapatkan point!</p>
            <div className="bg-blue-700 h-2 rounded-full mb-8">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-center mt-8">
              <button className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md">
                Mulai Tantangan!
              </button>
            </div>
          </div>
          
          {/* Third alphabet group */}
          <div 
            className={`bg-blue-800 rounded-lg p-4 cursor-pointer transition-all ${activeGroup === 2 ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setActiveGroup(2)}
          >
            <h3 className="text-xl font-bold mb-3 text-center">S - Z</h3>
            <p className="text-sm text-blue-300 mb-2">{alphabetGroups[2].letters}</p>
            <div className="bg-blue-700 h-2 rounded-full mb-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-300">Completed</span>
              <div className="flex items-center">
                <span className="text-xl font-bold mr-3">{alphabetGroups[2].completed}</span>
                <button className="bg-black hover:bg-gray-800 rounded w-8 h-8 flex items-center justify-center">
                  <span className="text-white">▶</span>
                </button>
              </div>
            </div>
          </div>         
        </div>

        {/* Bottom Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Content */}
          <div className="lg:col-span-2 bg-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Isi Modul</h2>
              <button className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors">
                Lihat Semua
              </button>
            </div>
            <div className="text-blue-100">
              {activeGroup !== null ? (
                <div>
                  <p className="mb-4">Modul pembelajaran untuk kelompok {alphabetGroups[activeGroup].range}:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Kosakata dasar</li>
                    <li>Pola kalimat sederhana</li>
                    <li>Latihan pengucapan</li>
                  </ul>
                </div>
              ) : (
                <p className="text-center py-4">Pilih kelompok huruf untuk melihat modul pembelajaran</p>
              )}
            </div>
          </div>
          
          {/* Weather Info Panel */}
          <div className="bg-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700">
            <h2 className="text-xl font-semibold mb-4">Pantauan Cuaca</h2>
            <div className="flex items-center space-x-4">
              <div className="text-5xl">☀️</div>
              <div>
                <p className="text-2xl font-bold">27°C</p>
                <p className="text-blue-200">Cerah Berawan</p>
                <p className="text-sm text-blue-300 mt-2">Update terakhir: 15:30 WIB</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-700">
              <p className="text-blue-200">Rekomendasi:</p>
              <p className="text-sm">Kondisi cuaca ideal untuk belajar!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}