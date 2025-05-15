import React from 'react';
import Logo from '../ui/Logo';
import { Link, useLocation } from 'react-router-dom';

const AuthLayout = ({ children, heading, subheading }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      {/* Navigation buttons at top right - hidden on mobile */}
      <div className="absolute top-8 right-16 z-10 hidden md:block">
        <Link 
          to={isLoginPage ? '/signup' : '/login'} 
          className="bg-[#1f1d4d] text-text-light py-2 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors"
        >
          {isLoginPage ? 'Sign Up' : 'Login'}
        </Link>
      </div>
      
      {/* Mobile View - Logo at top center, form below */}
      <div className="flex flex-col items-center pt-8 pb-4 md:hidden">
        <Logo size="medium" />
      </div>
      
      {/* Left side - Branding and Message - Hidden on mobile */}
      <div className="flex-1 hidden md:flex flex-col justify-center px-6 pb-12 md:pl-16 md:pr-8 md:py-0 md:min-h-screen">
        <div className="mb-6 md:mb-8">
          <Logo size="large" />
        </div>
        
        <div className="mt-2 md:mt-4 mb-8 md:mb-12">
          <div className="text-xs md:text-sm uppercase tracking-widest text-text-light opacity-80">
            HAND GESTURES IS UNIVERSAL LANGUAGE
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mt-2 md:mt-4 text-text-light leading-tight">
            Good <span className="text-secondary">gestures</span><br /> 
            build trust &<br />
            tell your story.
          </h1>
        </div>
        
        {/* Hand gesture illustration would go here */}
        <div className="mt-auto hidden md:block">
          {/* Placeholder for illustration */}
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="w-full md:w-[480px] md:pr-16 flex flex-col justify-center md:justify-center min-h-[60vh] md:min-h-screen pb-12">
        <div className="max-w-md w-full mx-auto my-auto md:mt-[108px]">
          <div className="bg-[#1f1d4d] p-6 rounded-lg shadow-lg">
            {heading && (
              <h2 className="text-2xl md:text-3xl font-bold text-text-light mb-1 md:mb-2">
                {heading}
              </h2>
            )}
            
            {subheading && (
              <p className="text-text-light opacity-80 mb-4 md:mb-6 text-sm md:text-base">
                {subheading}
              </p>
            )}
            
            {children}
          </div>
        </div>
      </div>
      
      {/* Mobile View - Branding after form */}
      <div className="flex flex-col px-6 pt-4 pb-8 md:hidden">
        <div className="text-xs uppercase tracking-widest text-text-light opacity-80 text-center">
          HAND GESTURES IS UNIVERSAL LANGUAGE
        </div>
        <div className="text-xl font-bold mt-2 text-text-light leading-tight text-center">
          Good <span className="text-secondary">gestures</span> build trust & tell your story.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 