import React from "react";
import Sidebar from "../layout/Sidebar";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
          <Sidebar />
          <main className="flex-1 p-8 flex flex-col items-center justify-center">
            <div className="text-2xl text-red-400">
              Terjadi kesalahan pada aplikasi
            </div>
            <p className="text-blue-300 mt-2">
              Mohon refresh halaman atau coba lagi nanti
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Refresh Halaman
            </button>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
