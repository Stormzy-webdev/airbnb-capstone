// Handles bookings — guests can make reservations, hosts can view and cancel them

const Reservation = require('../models/Reservation');

// POST /api/reservations — Guest books a listing
// Requires: accommodation ID, check-in/out dates, guest count, total price, host ID
const createReservation = async (req, res) => {
  const { accommodation, checkIn, checkOut, guests, totalPrice, host_id } = req.body;

  if (!accommodation || !checkIn || !checkOut || !guests || !totalPrice || !host_id) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const reservation = await Reservation.create({
    accommodation,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    host_id,
    user: req.user.id, // Taken from the JWT token — the logged-in guest
  });

  res.status(201).json(reservation);
};

// GET /api/reservations/host — Host sees all bookings for their properties
// populate() fetches the listing title/location and the guest's username in one go
const getReservationsByHost = async (req, res) => {
  const reservations = await Reservation.find({ host_id: req.user.id })
    .populate('accommodation', 'title location price images')
    .populate('user', 'username email');

  res.json(reservations);
};

// GET /api/reservations/user — Guest sees their own booking history
const getReservationsByUser = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id })
    .populate('accommodation', 'title location price images')
    .populate('user', 'username email');

  res.json(reservations);
};

// DELETE /api/reservations/:id — Cancel a reservation (the guest who booked it, the host it belongs to, or an admin)
const deleteReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const isGuest = reservation.user.toString() === req.user.id;
  const isHost = reservation.host_id.toString() === req.user.id;

  if (!isGuest && !isHost && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
  }

  await Reservation.findByIdAndDelete(req.params.id);

  res.json({ message: 'Reservation deleted' });
};

module.exports = {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
};
