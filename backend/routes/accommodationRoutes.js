const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');

router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);
router.post('/', protect, createAccommodation);
router.put('/:id', protect, updateAccommodation);
router.delete('/:id', protect, deleteAccommodation);

module.exports = router;
