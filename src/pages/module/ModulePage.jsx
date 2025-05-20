import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import ModuleItem from '../../components/modules/ModuleItem';

export default function ModulePage() {
  const navigate = useNavigate();
  
  const moduleItems = [
    { letter: 'A', status: 'Completed' },
    { letter: 'B', status: 'Not Completed' },
    { letter: 'C', status: 'Not Completed' },
    { letter: 'D', status: 'Not Completed' },
    { letter: 'E', status: 'Not Completed' },
    { letter: 'F', status: 'Not Completed' },
    { letter: 'G', status: 'Not Completed' },
    { letter: 'H', status: 'Not Completed' },
    { letter: 'I', status: 'Not Completed' },
    { letter: 'J', status: 'Not Completed' },
  ];

  const handleBackClick = () => {
    navigate('/belajar'); // Navigate back to BelajarPage
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Back Button */}
        <button 
          onClick={handleBackClick}
          className="flex items-center text-blue-200 mb-6 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali
        </button>

        {/* Module Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Isi Modul</h1>
          <h2 className="text-xl text-blue-200">Modul Pertama: A sampai J</h2>
        </header>

        {/* Module Content */}
        <div className="bg-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700 max-w-2xl">
          <div className="divide-y divide-blue-700">
            {moduleItems.map((item, index) => (
              <ModuleItem 
                key={index}
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