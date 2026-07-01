const Reservation = require('../models/Reservation');

// POST /api/reservations - create a reservation
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
    user: req.user.id,
  });

  res.status(201).json(reservation);
};

// GET /api/reservations/host - get all reservations for the logged-in host
const getReservationsByHost = async (req, res) => {
  const reservations = await Reservation.find({ host_id: req.user.id })
    .populate('accommodation', 'title location price images')
    .populate('user', 'username email');

  res.json(reservations);
};

// GET /api/reservations/user - get all reservations for the logged-in user
const getReservationsByUser = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id })
    .populate('accommodation', 'title location price images')
    .populate('user', 'username email');

  res.json(reservations);
};

// DELETE /api/reservations/:id - delete a reservation
const deleteReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
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
