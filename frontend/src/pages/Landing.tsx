import React from 'react';
import { Users, BookOpen, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Admin Login Card */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl shadow-lg p-8 hover:-translate-y-1 hover:shadow-xl transition-all">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-md mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-3">Admin Portal</h2>
          <p className="text-slate-600 mb-6">
            Manage students, assign tasks, and monitor progress
          </p>

          <a 
            href="/admin/login" 
            className="inline-flex items-center justify-center w-full gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            Login as Admin
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Student Login Card */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl shadow-lg p-8 hover:-translate-y-1 hover:shadow-xl transition-all">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl shadow-md mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-3">Student Portal</h2>
          <p className="text-slate-600 mb-6">
            See assignments, update status, and track your progress
          </p>

          <a 
            href="/student/login" 
            className="inline-flex items-center justify-center w-full gap-2 bg-purple-500 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:bg-purple-600 transition-all"
          >
            Login as Student
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
