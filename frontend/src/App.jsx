import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReservations from './pages/MyReservations';
import HostLogin from './pages/host/HostLogin';
import HostRegister from './pages/host/HostRegister';
import HostListings from './pages/host/Listings';
import HostCreateListing from './pages/host/CreateListing';
import HostUpdateListing from './pages/host/UpdateListing';
import HostReservations from './pages/host/Reservations';

// Wraps host dashboard pages — only host/admin accounts get through, everyone else is sent to the host login
const HostRoute = ({ children }) => {
  const { user } = useAuth();
  const isHost = user && (user.role === 'host' || user.role === 'admin');
  return isHost ? children : <Navigate to="/host/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<SearchResults />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservations" element={<MyReservations />} />

        <Route path="/host/login" element={<HostLogin />} />
        <Route path="/host/register" element={<HostRegister />} />
        <Route path="/host" element={<HostRoute><HostListings /></HostRoute>} />
        <Route path="/host/create" element={<HostRoute><HostCreateListing /></HostRoute>} />
        <Route path="/host/update/:id" element={<HostRoute><HostUpdateListing /></HostRoute>} />
        <Route path="/host/reservations" element={<HostRoute><HostReservations /></HostRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
