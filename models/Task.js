

const mongoose = require('mongoose');
 

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Project',
  required: true,
  }
}, {
    timestamps: true,
});
 
const Task = mongoose.model('Task', taskSchema);
 
module.exports = Task;