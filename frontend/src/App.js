import Login from './Login';
import DashBoard from './StaffDashboard';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/'element={<Login/>}/>
        <Route path='/dashboard'element={<DashBoard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
