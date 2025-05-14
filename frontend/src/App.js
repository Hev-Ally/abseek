import Login from './Login';
import DashBoard from './StaffDashboard';
import LandingPage from './LandingPage';
import Register from './Register';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
