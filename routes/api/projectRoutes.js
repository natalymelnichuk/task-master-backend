

const router = require('express').Router();
const { getProjects, createProject, updateProject, deleteProject, getProjectById } = require("../../controllers/projectControllers")
const { authMiddleware } = require('../../utils/auth');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/projects - Get all projects for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', getProjects);

// POST /api/projects - Create a new project
router.post('/', createProject);

// PUT /api/projects/:id - Update a project
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', deleteProject);

// Get Single Project
router.get('/:id', getProjectById);

module.exports = router;