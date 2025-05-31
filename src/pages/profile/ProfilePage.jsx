import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import { FaCamera, FaInfoCircle } from "react-icons/fa";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10">

          <div className="text-sm text-blue-200 mb-6">
              <span>Beranda</span>
              <span className="mx-2">/</span>
              <span className="text-blue-100 font-medium">Profile</span>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Profile</h1>
            <p className="text-lg text-blue-200">Perbarui informasi akun anda</p>
          </header>

          {/* form dan profile card */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
             {/* form */}
             <div className="lg:w-2/3 bg-blue-800/40 rounded-2xl p-8 shadow-xl border border-blue-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="User" 
                      className="rounded-full w-28 h-28 object-over border-4 border-white" 
                      />
                      <button className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-2 text-white">
                        <FaCamera size={16} />
                      </button>
                    </div>
                </div>

                <form action="#" className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">
                        Name < FaInfoCircle className="ml-1 text-blue-300" />
                      </label>
                      <input 
                        type="text"
                        placeholder="name"
                        className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium mb-2">Username</label>
                      <input 
                        type="text"
                        placeholder="username"
                        className="w-full px-4 py-2 rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 foucs:ring-yellow-400"
                        />
                    </div>

                    <div className="flex justify-center gap-4 pt-6">
                      <button type="button" 
                      className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full font-semibold">
                      Delete Account
                      </button>
                      <button type="button" 
                      className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-full font-semibold">
                      Save Changes
                      </button>
                    </div>

                </form>
             </div> 

             {/* profile card */}
             <div className="lg:w-1/3 bg-blue-800/50 rounded-2xl p-6 text-center shadow-xl border border-blue-700">
              <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="User" 
              className="mx-auto rounded-full border-4 border-yellow-400 w-24 h-24 object-cover mb-4"/>
              <h3 className="text-xl font-bold">User</h3>
              <p className="text-sm text-blue-200">User</p>
              <p className="text-yellow-400 text-lg mt-2 font-semibold">Score: 0</p>
             </div>
          </div>
      </main>
    </div>
  );
}