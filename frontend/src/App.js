import Login from './components/Login';
import DashBoard from './StaffDashboard';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />         {/* Landing Page sa / */}
        <Route path="/login" element={<Login />} />           {/* Login Page sa /login */}
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />   {/* Dashboard sa /dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
