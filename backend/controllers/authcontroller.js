const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const validateEmail = require('../utils/validateEmail');


exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Admin email must end with @gmail.com'
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: 'Admin already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Admin registered successfully'
    });

  } catch (err) {
    console.error('Admin Signup Error:', err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};


exports.adminLogin = async (req, res) => {
    try{
  const { email, password } = req.body;

  const adminexists = await Admin.findOne({ email });
  if (!adminexists) return res.status(400).json({ message: 'Admin not found.please signup first' });

  const match = await bcrypt.compare(password, adminexists.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: adminexists._id, role: 'admin' },process.env.JWT_SECRET,{ expiresIn: '12h' }
  );

  res.json({ token,message:' admin login successful' });
}catch(err){
    res.status(500).json({message:'internal server error'});
}
};


exports.studentLogin = async (req, res) => {
 try{
        const{email,password}=req.body;
        
        const studentexists = await Student.findOne({email});
        if(!studentexists) return res.status(400).json({message:'student not found.please signup first'});

        const ismatch = await bcrypt.compare(password,studentexists.password);
        if(!ismatch) return res.status(400).json({message:'invalid credentials'});

        const token = jwt.sign(
            {id:studentexists._id,role: 'student'},process.env.JWT_SECRET,{expiresIn:"12h"}
        );
        res.json({token,message:' student login successful'});
        

    }catch(err){
        res.status(500).json({message:'internal server error'});
    }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      createdBy: req.user.id 
    });

    res.status(201).json({
      message: 'Student registered successfully',
      studentId: student._id,
      name: student.name,
      email: student.email
    });

  } catch (err) {
    console.error('Create Student Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



