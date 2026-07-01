// All the logic for listings — anyone can view them, but only logged-in hosts can create, edit or delete

const Accommodation = require('../models/Accommodation');

// GET /api/accommodations — Return all listings (used by both the frontend and admin dashboard)
const getAccommodations = async (req, res) => {
  const accommodations = await Accommodation.find();
  res.json(accommodations);
};

// GET /api/accommodations/:id — Return a single listing by its MongoDB ID
const getAccommodationById = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  res.json(accommodation);
};

// POST /api/accommodations — Create a new listing (host only)
// The host's user ID comes from the decoded JWT token, not the request body
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

// PUT /api/accommodations/:id — Update an existing listing (host only)
const updateAccommodation = async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return res.status(404).json({ message: 'Listing not found' });
  }

  // { new: true } returns the updated document instead of the old one
  const updated = await Accommodation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// DELETE /api/accommodations/:id — Remove a listing permanently (host only)
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
