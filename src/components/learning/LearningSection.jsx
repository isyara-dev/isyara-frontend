import React from 'react';

export default function LearningSection() {
  return (
    <div className="bg-indigo-800 rounded-lg p-5 h-full">
      <h3 className="font-bold text-md mb-3">BELAJAR RANGKAI KATA</h3>
      
      <p className="text-sm text-indigo-200 mb-8">
        Rangkai kata dan dapatkan point!
      </p>
      
      <div className="h-32 flex items-end">
        <div className="w-full">
          <div className="h-1 w-full bg-indigo-700 rounded-full mb-8"></div>
          
          <button className="bg-indigo-500 hover:bg-indigo-400 text-white py-2 px-4 rounded-md w-full">
            Mulai Tantangan!
          </button>
        </div>
      </div>
    </div>
  );
}