const router = require('express').Router();
const auth = require('../middleware/authmiddleware');
const role = require('../middleware/rolemiddleware');
const controller = require('../controllers/taskcontroller');

router.post('/admin', auth, role('admin'), controller.createTask);
router.get('/student', auth, role('student'), controller.getStudentTasks);
router.put('/student/:id', auth, role('student'), controller.completeTask);
router.get('/admin', auth, role('admin'), controller.getAdminTasks);
router.delete('/admin/:id', auth, role('admin'), controller.deleteTask);
router.delete('/admin/:id',auth,role('admin'),controller.deleteStudent);
module.exports = router;
