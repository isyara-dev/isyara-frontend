import React from "react";
import Logo from "../ui/Logo";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";

const AuthLayout = ({ children, heading, subheading }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary to-background flex flex-col md:flex-row">
      {/* Navigation buttons at top right - hidden on mobile */}
      <div className="absolute top-8 right-16 z-10 hidden md:block">
        <Link to={isLoginPage ? "/signup" : "/login"}>
          <Button variant="primary" className="py-1 px-6">
            {isLoginPage ? "Sign Up" : "Login"}
          </Button>
        </Link>
      </div>

      {/* Mobile View - Logo at top center, form below */}
      <div className="flex flex-col items-center my-5 pb-2 md:hidden">
        <Logo size="large" />
        <div className="text-xl font-bold mt-1 pt-5 text-text-light leading-tight text-center">
          Good <span className="text-third">gestures</span> build trust & tell
          your story.
        </div>
        <div className="text-xs uppercase tracking-widest text-text-light opacity-80 text-center mt-2">
          HAND GESTURES IS UNIVERSAL LANGUAGE
        </div>
      </div>

      {/* Left side - Branding and Message - Hidden on mobile */}
      <div className="flex-1 hidden md:flex flex-col justify-center px-6 pb-12 md:pl-16 md:pr-8 md:py-0 md:min-h-screen">
        <div className="my-6 md:mb-8">
          <Logo size="large" />
        </div>

        <div className="mt-2 md:mt-4 mb-8 md:mb-12">
          <div className="text-xs md:text-sm uppercase tracking-widest text-text-light opacity-80">
            HAND GESTURES IS UNIVERSAL LANGUAGE
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mt-2 md:mt-4 text-text-light leading-tight">
            Good <span className="text-secondary">gestures</span>
            <br />
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
      <div className="w-full md:w-[480px] md:pr-16 flex flex-col justify-center md:justify-center min-h-[60vh] md:min-h-screen pb-8">
        <div className="max-w-md w-full mx-auto my-auto md:mt-[108px] px-4 sm:px-6">
          <div className="bg-[#1f1d4d] p-4 sm:p-5 rounded-lg shadow-lg">
            {heading && (
              <h2 className="text-xl md:text-2xl font-bold text-text-light mb-1">
                {heading}
              </h2>
            )}

            {subheading && (
              <p className="text-text-light opacity-80 mb-3 text-sm">
                {subheading}
              </p>
            )}

            {children}
          </div>
        </div>
      </div>

      {/* Mobile View - Removed branding after form since we moved it above */}
    </div>
  );
};

export default AuthLayout;
