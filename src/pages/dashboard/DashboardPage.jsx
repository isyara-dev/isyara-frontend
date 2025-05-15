import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-light">ISYARA Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-text-light">
              {currentUser ? `Welcome, ${currentUser.name}` : 'Welcome'}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main>
          <div className="bg-background bg-opacity-40 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-text-light mb-4">Welcome to ISYARA</h2>
            <p className="text-text-light mb-6">
              This is your dashboard. You can manage your account and access application features from here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-button-primary bg-opacity-20 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-text-light mb-2">Hand Gesture Recognition</h3>
                <p className="text-text-light opacity-80 mb-4">Use our advanced AI to recognize hand gestures in real-time.</p>
                <Link to="/gestures" className="text-secondary hover:underline">Get started →</Link>
              </div>
              
              <div className="bg-button-primary bg-opacity-20 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-text-light mb-2">Learning Center</h3>
                <p className="text-text-light opacity-80 mb-4">Learn about hand gestures and sign language through interactive lessons.</p>
                <Link to="/learn" className="text-secondary hover:underline">Start learning →</Link>
              </div>
              
              <div className="bg-button-primary bg-opacity-20 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-text-light mb-2">My Profile</h3>
                <p className="text-text-light opacity-80 mb-4">Manage your account settings and preferences.</p>
                <Link to="/profile" className="text-secondary hover:underline">View profile →</Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-text-light opacity-70 text-sm">
          <p>© {new Date().getFullYear()} ISYARA. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage; 