// File: components/AlphabetCard.jsx
import React from 'react';
import { Play } from 'lucide-react';

export default function AlphabetCard({ group }) {
  return (
    <div className="bg-indigo-800 rounded-lg p-5 relative">
      <h3 className="font-medium text-md mb-2">{group.title}</h3>
      
      <div className="flex flex-wrap mb-3">
        {group.letters.map((letter) => (
          <span key={letter} className="mr-1">{letter}</span>
        ))}
      </div>
      
      <div className="h-1 w-full bg-indigo-600 rounded-full mb-3">
        <div 
          className="h-1 bg-indigo-300 rounded-full" 
          style={{ width: `${group.progress}%` }} 
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="text-indigo-300">Completed</span>
          <div className="font-bold text-lg">{group.completed}</div>
        </div>
        
        <button className="bg-indigo-500 hover:bg-indigo-400 p-2 rounded-full text-white">
          <Play size={16} fill="white" />
        </button>
      </div>
    </div>
  );
}
