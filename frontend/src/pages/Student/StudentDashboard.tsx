import React from 'react';
import { useState, useEffect } from 'react';
import {Calendar,Clock,CheckCircle2,AlertCircle,X,Folder,Eye} from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Pending' | 'Completed' | 'Overdue';
}

type FilterStatus = 'All' | 'Pending' | 'Completed' | 'Overdue';

export default function StudentDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/student');
      setTasks(response.data);
    } catch (err: any) {
     console.error('Error fetching students:',err.response?.data?.message || err.message
  );
} finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string) => {
    try {
      await api.put(`/tasks/student/${taskId}`, { status: 'Completed' });
      setMessage({ type: 'success', text: 'Task marked as completed!' });
      fetchTasks();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update task',
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'Overdue':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const filters: FilterStatus[] = ['All', 'Pending', 'Completed', 'Overdue'];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600 mb-8">Track and manage your assignments</p>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border-gray-100 p-6 mb-6">
          <div className="flex gap-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center rounded-xl">
            Loading tasks...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-2xl border-gray-300 p-6 hover:shadow-lg cursor-pointer"
              >
                <div className="flex gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-gray-600">
                      {task.description.length > 80
                        ? task.description.slice(0, 80) + '...'
                        : task.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center ml-14">
                  <span className="text-sm text-gray-500">
                    Due: {formatDate(task.deadline)}
                  </span>

                  <div className="flex flex-col gap-3 md:items-end">
                     <span
                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                         task.status
                       )}`}
                     >
                       {task.status}
                     </span>

                     <div className="flex flex-col gap-3 md:items-end">

                  {task.status === 'Pending' && (
                 <button
                   onClick={(e) => {
    e.stopPropagation();
    handleStatusUpdate(task._id);
  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                 >
                 Mark as Completed
                    </button>
                 )}

                {task.status === 'Completed' && (
                  <span className="text-sm text-green-600 font-medium">
                 ✔ Task completed
                </span>
                  )}

               {task.status === 'Overdue' && (
              <span className="text-sm text-red-600 font-medium">
               Deadline missed
               </span>
              )}
            </div>
          </div>
         </div>
        </div>
      ))}
     </div>
    )}
   </div>

        
      
      {/* ================= MODAL ================= */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-3">{selectedTask.title}</h2>
             
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-gray-700 whitespace-pre-wrap mb-6">
              {selectedTask.description}
            </p>
            <div className="flex flex-col justify-center gap-1 mb-4">
              <span
                className={`px-6 py-1 rounded-full text-sm ${getStatusColor(
                  selectedTask.status
                )}`}
              >
                {selectedTask.status}
              </span>
              <span className="text-sm text-gray-600">
                Due: {formatDate(selectedTask.deadline)}
              </span>
            </div>
            </div>

  
          </div>
        </div>
      )}

     

    </DashboardLayout>
  );
}
