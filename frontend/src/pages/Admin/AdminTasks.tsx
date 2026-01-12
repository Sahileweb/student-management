import React from 'react';
import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, User,Folder, Eye } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ClipboardList } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  studentId: { name: string }; // Adjust based on your Backend Populate logic
  status: string;
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState<{
      title: string;
      description: string;
      deadline: string;
      studentId: string;
    }>({
      title: '',
      description: '',
      deadline: '',
      studentId: '',
    });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    // 1. Fetch data from backend
    const [studentsRes, tasksRes] = await Promise.all([
      api.get('/auth/admin/students'),
      api.get('/tasks/admin')
    ]);


    // 3. Safety check: Ensure we are setting an array
    const studentData = Array.isArray(studentsRes.data) 
      ? studentsRes.data 
      : studentsRes.data.students || [];

    setStudents(studentData);
    setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
    
  } catch (err: any) {
     console.error(
    'Error fetching students:',
    err.response?.data?.message || err.message
  );
}finally {
    setLoading(false);
  }
};

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks/admin", taskForm);

      setMessage({ type: 'success', text: 'Task assigned successfully!' });
      setTaskForm({ title: '', description: '', deadline: '', studentId: ''});
      fetchData(); 
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to assign task' });
    }
  };

  const getAdminstatus=(task:any)=>{
    const deadlinepassed = new Date(task.deadline) < new Date();
    if(task.status==="Completed"){
      return "Completed"
    }
    if(task.status === "Pending" && deadlinepassed ||  task.status === 'Overdue'){
      return 'Not Submitted'
    }
    return "Pending";
  }

  const handledeletetask=async(taskId:string)=>{
    const confirmDelete = window.confirm("Are u sure u want to delete this Task ?")
    if(!confirmDelete) return;

    try{
      await api.delete(`/tasks/admin/${taskId}`);
      setTasks((prev)=>prev.filter((task)=>task._id!==taskId));
      setMessage({type:"success",text:"Task Deleted Succesfully"});
      setTimeout(()=>setMessage({type:'',text:''}),3000);
    }catch(err:any){
      setMessage({
      type: 'error',
      text: err.response?.data?.message || 'Failed to delete task',
    });
    }

  }
  
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Task Commander</h1>
        </div>
      <p className="text-gray-500 mb-10">Assign, track, and conquer tasks for all students effortlessly.</p>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Task List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" /> Existing Tasks
              </h2>

              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks assigned yet.</div>
              ) : (
               <div className="space-y-4">
  {tasks.map((task) => (
    <div key={task._id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      
    
      <div className="flex justify-between items-start gap-4">
        
       
           <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate pr-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {task.description}
          </p>
          </div>

           
            <div className="flex items-center gap-25 shrink-0">
             <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              getAdminstatus(task) === 'Completed'
                ? 'bg-green-100 text-green-700'
                : getAdminstatus(task) === 'Not Submitted'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
             }`}
               >
            {getAdminstatus(task)}
               </span>

             <button
            onClick={() => handledeletetask(task._id)}
            title="Delete Task"
            className="text-red-500 hover:text-red-800 transition-colors"
              >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
             </button>
              </div>

               </div>

     
             <div className="mt-4 flex gap-4 text-xs text-gray-500">
             <span className="flex items-center gap-1">
             <User className="w-3 h-3" /> {task.studentId?.name || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {new Date(task.deadline).toLocaleDateString()}
            </span>
           </div>
          
      


            </div>
          ))}
         </div>
              )}
            </div>
          </div>

          {/* Right Column: Creation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Assign New Task
              </h2>
              <form onSubmit={handleAssignTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Student</label>
                <select
                  required
                       value={taskForm.studentId}
                       onChange={(e) => setTaskForm({ ...taskForm, studentId: e.target.value })}
                       className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                  <option value="">Select Student</option>
                    {students.length > 0 ? (
                      students.map((s) => (
                       <option key={s._id} value={s._id}>
                           {s.name} ({s.email})
                  </option>
                   ))
                   
                   ) : (
                      <option disabled>No students assigned to you found</option>
                     )}
                </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all">
                  Assign Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
