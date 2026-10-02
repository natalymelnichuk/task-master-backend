
const router = require('express').Router();
const {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../../controllers/taskController');
const { authMiddleware } = require('../../utils/auth');

// All routes in this file will require authentication
router.use(authMiddleware);

// POST /api/tasks — Create a new task
router.post('/', createTask);

// GET, PUT, DELETE /api/tasks/:id — Work with a specific task
router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;