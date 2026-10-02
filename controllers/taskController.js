
const Task = require('../models/Task');
const Project = require('../models/Project');

// POST /api/tasks — Create a new task
async function createTask(req, res) {
    try {
        // 1. Check if the user has access to the project
        const project = await Project.findOne({
        _id: req.body.project,
        user: req.user._id,
        });

        if (!project) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        // 2. Create the task
        const task = await Task.create(req.body);

        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Error creating task', error: err.message });
    }
}

// GET /api/tasks/project/:projectId — Get all tasks for a specific project
async function getTasksByProject(req, res) {
    try {
        // Check if the user has access to the project
        const project = await Project.findOne({
        _id: req.params.projectId,
        user: req.user._id,
        });

        if (!project) {
        return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        const tasks = await Task.find({ project: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// PUT /api/tasks/:id — Update a task (e.g., change status to 'In Progress' or 'Done')
async function updateTask(req, res) {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the project of this task belongs to the current user
        if (task.project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: 'Error updating task', error: err.message });
    }
}

// DELETE /api/tasks/:id — Delete a task
async function deleteTask(req, res) {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }

        if (task.project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this task' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Optional: Secure “Get Task”
async function getTaskById(req, res) {
    try {
        // 1. Find the task with an id
        const task = await Task.findById(req.params.id).populate('project');
        if (!task) {
        return res.status(404).json({ message: 'No task found with this id!' });
        }

        // 2. Check ownership
        if (task.project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to view this task!' });
        }

        // 3. If everything if fine, user'll be able to get this task
        res.json(task);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    getTaskById
};