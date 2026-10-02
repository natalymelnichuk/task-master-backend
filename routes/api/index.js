const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');

// All project routes will be prefixed with /projects
router.use('/projects', projectRoutes);

// All users routes will be prefixed with /users
router.use('/users', userRoutes);

module.exports = router;