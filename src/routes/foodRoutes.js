const express = require('express');
const router = express.Router();

const {
  syncMeals,
  getAllFoods,
  getFoodById,
  getAreas
} = require('../controllers/foodController');

// Sync foods
router.post('/sync', syncMeals);

// Areas
router.get('/areas', getAreas);

// Get all foods
router.get('/', getAllFoods);

// Get food by ID
router.get('/:id', getFoodById);

module.exports = router;
