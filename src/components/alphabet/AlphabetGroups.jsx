import React from 'react';
import AlphabetCard from './AlphabetCard';

export default function AlphabetGroups() {
  const alphabetGroups = [
    {
      id: 'a-i',
      title: 'A – I',
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      completed: '14/24',
      progress: 60
    },
    {
      id: 'j-r',
      title: 'J – R',
      letters: ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
      completed: '12/18',
      progress: 70
    },
    {
      id: 's-z',
      title: 'S – Z',
      letters: ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      completed: '10/16',
      progress: 60
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alphabetGroups.map((group) => (
        <AlphabetCard key={group.id} group={group} />
      ))}
    </div>
  );
}