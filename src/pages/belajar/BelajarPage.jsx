import React, { useState } from 'react';

const Sidebar = () => (
  <div className="w-64 bg-blue-900 p-6 flex flex-col">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-yellow-400">ISYARA</h1>
    </div>
    <nav className="space-y-2">
      <div className="bg-yellow-400 text-black px-4 py-3 rounded-lg font-medium">
        BELAJAR
      </div>
      <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
        PAPAN SKOR
      </div>
      <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
        PROFILE
      </div>
      <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
        PENGATURAN
      </div>
      <div className="text-blue-300 px-4 py-3 hover:bg-blue-800 rounded-lg cursor-pointer">
        KELUAR
      </div>
    </nav>
    <div className="mt-auto">
      <div className="text-yellow-400 text-sm">ISYARA</div>
      <div className="text-blue-300 text-xs">dicoding</div>
    </div>
  </div>
);

export default function BelajarPage() {
  const [activeGroup, setActiveGroup] = useState(null);
  
  const alphabetGroups = [
    { 
      range: 'A – I', 
      letters: 'A B C D E F G H I',
      completed: '14/24'
    },
    { 
      range: 'J – R', 
      letters: 'J K L M N O P Q R',
      completed: '12/18' 
    },
    { 
      range: 'S – Z', 
      letters: 'S T U V W X Y Z',
      completed: '10/16' 
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-blue-200 mb-6">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-100">Belajar</span>
        </div>

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Belajar Rangkai Kata</h1>
          <p className="text-lg text-blue-200">Pilih kelompok huruf dan mulai tantangan!</p>
        </header>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Left Section - Alphabet Groups */}
          <div className="lg:col-span-3 bg-blue-800/30 rounded-xl p-6 border border-blue-600/50">
            <h2 className="text-xl font-semibold mb-6">Kelompok Huruf</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alphabetGroups.map((group, index) => (
                <div 
                  key={index}
                  className={`bg-blue-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-blue-600 ${activeGroup === index ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => setActiveGroup(index)}
                >
                  <h3 className="text-lg font-bold mb-3 text-center">{group.range}</h3>
                  <p className="text-sm text-blue-200 mb-3 text-center tracking-wider">{group.letters}</p>
                  <div className="bg-blue-600 h-2 rounded-full mb-3">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${index === 0 ? '58%' : index === 1 ? '67%' : '63%'}` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-blue-300 block">Completed</span>
                      <span className="text-lg font-bold">{group.completed}</span>
                    </div>
                    <button className="bg-black hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                      <span className="text-white text-sm">▶</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Section - Challenge Section */}
          <div className="bg-blue-800 rounded-xl p-6 border border-blue-600/50 flex flex-col ">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-bold mb-3 text-center">BELAJAR RANGKAI KATA</h3>
                <p className="text-blue-300 text-center mb-8 text-sm">Rangkai kata dan dapatkan point!</p>
                <div className="bg-blue-700 h-2 rounded-full mb-4">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full">
                  Mulai Tantangan!
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Isi Modul */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Isi Modul</h2>
              <button className="text-sm bg-black hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
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
                    <li>Contoh penggunaan dalam kalimat</li>
                    <li>Latihan interaktif</li>
                  </ul>
                </div>
              ) : (
                <p className="text-center py-4">Pilih kelompok huruf untuk melihat modul pembelajaran</p>
              )}
            </div>
          </div>
          <div className="lg:col-span-1"></div>
        </div>
      </main>
    </div>
  );
}