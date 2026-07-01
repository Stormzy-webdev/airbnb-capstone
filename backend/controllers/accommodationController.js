const Accommodation = require('../models/Accommodation');

// GET /api/accommodations - get all listings
const getAccommodations = async (req, res) => {
  const accommodations = await Accommodation.find();
  res.json(accommodations);
};

// GET /api/accommodations/:id - get a single listing
const getAccommodationById = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  res.json(accommodation);
};

// POST /api/accommodations - create a new listing
const createAccommodation = async (req, res) => {
  const {
    title, type, location, description, guests, bedrooms,
    bathrooms, amenities, images, price, weeklyDiscount,
    cleaningFee, serviceFee, occupancyTaxes,
  } = req.body;

  if (!title || !type || !location || !description || !guests || !bedrooms || !bathrooms || !price) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const accommodation = await Accommodation.create({
    title, type, location, description, guests, bedrooms,
    bathrooms, amenities, images, price, weeklyDiscount,
    cleaningFee, serviceFee, occupancyTaxes,
    host: req.user.id,
    host_id: req.user.id,
  });

  res.status(201).json(accommodation);
};

// PUT /api/accommodations/:id - update a listing
const updateAccommodation = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  const updated = await Accommodation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// DELETE /api/accommodations/:id - delete a listing
const deleteAccommodation = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  await Accommodation.findByIdAndDelete(req.params.id);

  res.json({ message: 'Listing deleted' });
};

module.exports = {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};
