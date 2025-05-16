# Integrasi Google Auth di ISYARA

## Di Frontend (React)

### 1. Setup Environment Variables

Buat file `.env` di root project React Anda:

```
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:3000/api
```

### 2. Install Dependency

```bash
npm install @supabase/supabase-js
```

### 3. Setup Supabase Client

Buat file `src/services/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

### 4. Implementasi Auth Context

Buat file `src/contexts/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          // Save user data to backend
          await saveUserToBackend(session.user);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          // Save user data to backend when auth state changes
          await saveUserToBackend(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login dengan Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function untuk mengirim data user ke backend
  const saveUserToBackend = async (userData) => {
    try {
      if (!userData) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/save-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id,
          email: userData.email,
          username: userData.user_metadata?.full_name || userData.email.split('@')[0],
          avatar_url: userData.user_metadata?.avatar_url
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data to backend');
      }

      const data = await response.json();
      // Update user with additional data from backend
      setUser(prevUser => ({
        ...prevUser,
        ...data
      }));
      
    } catch (err) {
      console.error('Error saving user to backend:', err);
      setError(err.message);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
```

### 5. Buat Google Login Button Component

Buat file `src/components/auth/GoogleLoginButton.jsx`:

```javascript
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GoogleLoginButton = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google Logo" 
        className="w-5 h-5"
      />
      {loading ? 'Loading...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleLoginButton;
```

### 6. Buat Auth Callback Page

Buat file `src/pages/auth/AuthCallback.jsx`:

```javascript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../services/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Redirect user to dashboard or home page once authenticated
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
```

### 7. Update Router dan App.jsx

Untuk mengintegrasikan Google Auth dengan React Router:

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AuthCallback from './pages/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 8. Protected Route Component

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 9. Menggunakan Auth di Login Page

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { user, error } = useAuth();

  // Redirect if already logged in
  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to ISYARA</h1>
          <p className="text-gray-600 mt-2">Sign in to continue learning sign language</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GoogleLoginButton />
          
          <div className="text-center text-sm text-gray-500">
            <p>Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

## Konfigurasi Supabase

1. Buka dashboard Supabase project Anda
2. Navigasi ke Authentication -> Providers
3. Aktifkan Google provider
4. Isi Client ID dan Client Secret dari Google Cloud Console
5. Tambahkan Authorized redirect URI: `https://[your-supabase-project].supabase.co/auth/v1/callback`

## Konfigurasi Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru (atau gunakan yang sudah ada)
3. Aktifkan Google Identity Platform (OAuth) API
4. Buat OAuth 2.0 Client ID di Credentials
5. Tambahkan domain aplikasi Anda di Authorized JavaScript origins:
   - http://localhost:5173 (untuk development)
   - https://yourdomain.com (untuk production)
6. Tambahkan URL redirect di Authorized redirect URIs:
   - https://[your-supabase-project].supabase.co/auth/v1/callback
   - http://localhost:5173/auth/callback (untuk development)
   - https://yourdomain.com/auth/callback (untuk production)

## Testing Integrasi

Untuk memastikan integrasi berjalan dengan baik:

1. Mulai aplikasi frontend Anda (`npm run dev`)
2. Klik tombol "Continue with Google"
3. Lakukan login dengan akun Google
4. Setelah login berhasil, Anda akan diarahkan ke halaman callback
5. Periksa console browser dan network tab untuk memastikan request ke `/auth/save-user` berjalan dengan baik
6. Cek di database Supabase untuk memastikan data user telah tersimpan

Jika mengalami masalah, periksa:
- Log error di console browser
- Network requests di DevTools
- Log server backend
- Konfigurasi URL callback di Supabase dan Google Console

## Endpoint Backend yang Digunakan

Backend harus menyediakan endpoint:

```
POST /api/auth/save-user
GET /api/auth/me (protected, memerlukan token)
```

Endpoint tersebut sudah tersedia di backend ISYARA sesuai dengan implementasi di `controllers/authController.js`.
```

## 4. Testing Tanpa Frontend

Untuk testing tanpa menunggu frontend, Anda bisa:

1. **Matikan RLS** untuk tabel users (jika masih diaktifkan)
2. **Buat Manual Endpoint** untuk testing:

```javascript:routes/authRoutes.js
// Tambahkan endpoint ini untuk testing
router.post('/test-google-user', async (req, res) => {
  try {
    // Buat data dummy seperti yang akan dikirim frontend
    const testUser = {
      id: "google-user-id-123", // Dummy ID
      email: "test.google@example.com",
      username: "Google User",
      avatar_url: "https://lh3.googleusercontent.com/test-avatar.jpg",
      login_method: "google"
    };
    
    // Cek apakah user sudah ada
    let { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUser.id)
      .maybeSingle();
    
    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user:', findError);
      return res.status(500).json({ error: 'Database error when finding user' });
    }
    
    // Simpan user jika belum ada
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: testUser.id,
          email: testUser.email,
          username: testUser.username,
          avatar_url: testUser.avatar_url,
          point: 0,
          login_method: testUser.login_method,
          created_at: new Date()
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create test user' });
      }
      
      return res.status(201).json(newUser);
    }
    
    return res.status(200).json(existingUser);
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({ error: 'Test failed' });
  }
});
```

Kemudian tes dengan: 
```