const express = require('express');
const router = express.Router();
const role = require('../middleware/rolemiddleware');
const Student = require('../models/Student');
const Task = require('../models/Task');

const {adminSignup,adminLogin,studentLogin,createStudent} = require('../controllers/authcontroller');
const authmiddleware = require('../middleware/authmiddleware');


router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);


router.post('/student/login', studentLogin);


router.get('/admin/students', authmiddleware, async (req, res) => {
  try {
    const students = await Student.find(
      { createdBy: req.user.id,isDeleted: false  }, 
      '_id name email'
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/tasks/student', authmiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ studentId: req.user.id }).populate('adminId', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/admin/student/register',authmiddleware,createStudent);
module.exports = router;
