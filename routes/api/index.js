const router = require('express').Router();
const userRoutes = require('./userRoutes');

// All users routes will be prefixed with /users
router.use('/users', userRoutes);

module.exports = router;