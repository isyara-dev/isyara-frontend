import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient';

const TestSupabase = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Coba mendapatkan session untuk menguji koneksi
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setStatus('Connection successful! Supabase is working.');
        console.log('Supabase session data:', data);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setError(err.message);
        setStatus('Connection failed.');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <div className={`p-4 rounded mb-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <p className="font-medium">{status}</p>
          {error && (
            <p className="mt-2 text-sm">
              Error: {error}
            </p>
          )}
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-sm">
            Check the browser console for more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase; 