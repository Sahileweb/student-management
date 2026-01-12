import React from 'react';
import { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { LayoutDashboard } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);


  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
  });


  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/auth/admin/students');
      setStudents(response.data);
    } catch (err: any) {
     console.error(
    'Error fetching students:',
    err.response?.data?.message || err.message
  );
}
 finally {
      setLoading(false);
    }
  };
  

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/admin/student/register', studentForm);
      setMessage({ type: 'success', text: 'Student added successfully!' });
      setStudentForm({ name: '', email: '', password: '' });
      fetchStudents();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add student' });
    }
  };



   const handledeletestudent=async(studentId:string)=>{
    const confirmDelete = window.confirm("Are u sure u want to delete thsi Student?")
    if(!confirmDelete) return;

    try{
      await api.delete(`/tasks/admin/${studentId}`);
       setStudents((prev)=>prev.filter((students)=>students._id!==studentId));
      setMessage({type:"success",text:"Student Deleted Succesfully"});
      setTimeout(()=>setMessage({type:'',text:''}),3000);
    }catch(err:any){
      setMessage({
      type: 'error',
      text: err.response?.data?.message || 'Failed to delete Student',
    });
    }
  }
  

return (
    <DashboardLayout>
      <div className="max-w-7xl  mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Student Central</h1>
        </div>
        <p className="text-gray-500 mb-10">Add, manage, and empower your students with a single click.</p>

        {/* Feedback Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Student List Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Registered Students</h2>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No students found. Use the form to add a new student.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-gray-900 font-medium">{student.name}</td>
                          <td className="py-4 px-4 text-gray-600">{student.email}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-4">   
                      <button 
                      onClick={()=>handledeletestudent(student._id)}
                      className='text-red-500 hover:text-red-800 text-sm font-medium title="Delete Task"'>
                      <FontAwesomeIcon icon={faTrash} />
                      </button>
                      </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Add Student Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <Plus className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Add Student</h2>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="student@university.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-100"
                >
                  Create Student Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
