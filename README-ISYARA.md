# ISYARA Frontend Project

## Project Overview
ISYARA is a web application focused on hand gestures recognition. This repository contains the frontend implementation built with React and Tailwind CSS v4.

## Directory Structure
```
src/
├── assets/          # Static files like images, icons, etc.
├── components/      # Reusable UI components
│   ├── auth/        # Authentication related components
│   ├── layout/      # Layout components like containers, wrappers
│   └── ui/          # Basic UI components like buttons, inputs
├── contexts/        # React Context providers
│   └── AuthContext.jsx   # Authentication context
├── pages/           # Page components
│   ├── auth/        # Authentication pages (login, register)
│   └── dashboard/   # Dashboard pages
├── services/        # API services
│   └── auth/        # Authentication services
├── App.jsx          # Main application component
├── index.css        # Global CSS
└── main.jsx         # Application entry point
```

## Authentication Implementation
The authentication system is set up to work with:
- Express.js backend
- Supabase for database storage
- Google OAuth for social login

### Features Implemented
- Login form with username/password
- Registration form with validation
- Social login buttons (Google, Facebook, GitHub)
- "Remember me" functionality
- Forgot password link

## UI Components
The UI is built using Tailwind CSS v4 with custom theme variables:
- Custom color theme with primary and secondary colors
- Responsive design for mobile and desktop views
- Reusable components like buttons, inputs, checkboxes

## Getting Started

1. **Install dependencies**
   ```
   npm install
   ```

2. **Start the development server**
   ```
   npm run dev
   ```

3. **Build for production**
   ```
   npm run build
   ```

## Environment Variables
Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:3000/api
```

## Next Steps
- Complete backend integration
- Implement Google OAuth
- Add protected routes
- Set up user profile management 