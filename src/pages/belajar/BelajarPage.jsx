import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function BelajarPage() {
  const [activeGroup, setActiveGroup] = useState(null);
  
  const alphabetGroups = [
    { 
      range: 'A - I', 
      letters: [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I']
      ],
      completed: '14/24'
    },
    { 
      range: 'J - R', 
      letters: [
        ['J', 'K', 'L'],
        ['M', 'N', 'O'],
        ['P', 'Q', 'R']
      ],
      completed: '12/18' 
    },
    { 
      range: 'S - Z', 
      letters: [
        ['S', 'T', 'U'],
        ['V', 'W', 'X'],
        ['Y', 'Z', '']
      ],
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

        {/* Alphabet Groups */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Kelompok Huruf</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alphabetGroups.map((group, index) => (
              <div 
                key={index}
                onClick={() => setActiveGroup(index)}
                className={`bg-blue-800/50 rounded-xl p-6 shadow-lg border-2 transition-all cursor-pointer
                  ${activeGroup === index ? 'border-yellow-400' : 'border-blue-700 hover:border-blue-500'}`}
              >
                <h3 className="text-xl font-bold mb-4 text-center">{group.range}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {group.letters.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {row.map((letter, letterIndex) => (
                        <div 
                          key={letterIndex}
                          className="bg-blue-700/70 rounded-lg p-3 text-center font-bold text-lg hover:bg-blue-600 transition-colors"
                        >
                          {letter}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-center text-yellow-300 font-medium">
                  Selesai: {group.completed}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module Content - Takes 2/3 width on desktop */}
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
          
          {/* Challenge Section - Takes 1/3 width on desktop */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-yellow-500/90 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-3 text-center">BELAJAR RANGKAI KATA</h2>
              <p className="text-center mb-4">Rangkai kata dan dapatkan poin!</p>
              <button 
                onClick={() => activeGroup !== null && alert(`Memulai tantangan untuk kelompok ${alphabetGroups[activeGroup].range}`)}
                disabled={activeGroup === null}
                className={`w-full py-3 rounded-lg font-bold transition-all
                  ${activeGroup !== null 
                    ? 'bg-white text-yellow-700 hover:bg-yellow-100 shadow-md' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Mulai Tantangan!
              </button>
            </div>

            {/* Weather Info */}
            <div className="bg-blue-800/50 rounded-xl p-4 text-center text-sm flex items-center justify-center space-x-2">
              <span>☀️</span>
              <p>27°C • Cerah Berawan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}