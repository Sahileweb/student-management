const Task = require('../models/Task');
const Student = require('../models/Student');

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, studentId } = req.body;

    if (!title || !description || !deadline || !studentId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      studentId,
      adminId: req.user.id,
      createdBy: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Create Task Error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.getStudentTasks = async (req, res) => {
  try {
    await Task.updateMany(
      {
        studentId: req.user.id,
        deadline: { $lt: new Date() },
        status: 'Pending'
      },
      { $set: { status: 'Overdue' } }
    );

    const tasks = await Task.find({
      studentId: req.user.id,
      isDeleted: false
    }).sort({ deadline: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    if (req.body.status !== 'Completed') {
      return res.status(400).json({ message: 'Invalid update' });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      studentId: req.user.id,
      status: 'Pending'
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found or already locked'
      });
    }

    task.status = 'Completed';
    await task.save();

    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
        adminId: req.user.id, 
        isDeleted: false 
      })
      .populate('studentId', 'name email')
      .sort({ deadline: -1 });

    const formattedTasks = tasks.map(task => {
      return {
        ...task.toObject(),
        adminStatus:
          task.status === 'Overdue' ? 'Not Submitted' : task.status
      };
    });

    res.json(formattedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  await Task.findByIdAndUpdate(  {
        _id: req.params.id,     
        createdBy: req.user.id  
      }, { isDeleted: true });
  res.json({ message: 'Task deleted' });
};

exports.deleteStudent = async (req, res) => {
 await Student.findOneAndUpdate(
  { _id: req.params.id, createdBy: req.user.id },
  { isDeleted: true }
);
  res.json({ message: 'Student deleted' });
};
