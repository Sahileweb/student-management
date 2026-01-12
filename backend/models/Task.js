const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
     title:{ 
        type:String,
         required:true,
         }, 
    description:{ 
        type:String, 
        required:true 
         },
    deadline:{ 
        type:Date, 
        required:true, }, 
    status:{ 
            type:String,
            enum:["Pending", "Completed", "Overdue"],
            default:'Pending',
             },         
    studentId:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'Student', 
            require:true, 
        }, 
    adminId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Admin',
           required: true
       },
    
    isDeleted:{
        type:Boolean,
        default:false,
    } 
        },{ timestamps: true }) 

module.exports = mongoose.model('Task', taskSchema);
