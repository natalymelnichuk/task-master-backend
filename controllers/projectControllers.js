
const Project = require('../models/Project');


// GET /api/projects - Get all projects for the logged-in user
async function getProjects(req, res) {
  // This currently finds all projects in the database.
  // It should only find projects owned by the logged in user.
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
};
 
// POST /api/projects - Create a new project
async function createProject(req, res) {
    try {
        const project = await Project.create({
        ...req.body,
        // The user ID needs to be added here
        user: req.user._id
        
        });
        
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json(err);
    }
};
 
// PUT /api/projects/:id - Update a project
async function updateProject (req, res) {
    try {
        // This needs an authorization check
        const project = await Project.findById(req.params.id);
        if (!project) {
        return res.status(404).json({ message: 'No project found with this id!' });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this project!' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        )
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE /api/projects/:id - Delete a project
async function deleteProject (req, res) {
    try {
        // This needs an authorization check
        const project = await Project.findById(req.params.id);
        if (!project) {
        return res.status(404).json({ message: 'No project found with this id!' });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this project!' });
        }

        await project.deleteOne();

        res.json({ message: 'Project deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Optional: Secure “Get Single Project”
async function getProjectById(req, res) {
    try {
        // 1. Find the project with an id
        const project = await Project.findById(req.params.id);

        if (!project) {
        return res.status(404).json({ message: 'No project found with this id!' });
        }

        // 2. Check ownership
        if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to view this project!' });
        }

        // 3. If everything if fine, user'll be able to get this project
        res.json(project);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById
}; 


