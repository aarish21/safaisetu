import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import ReportForm from "./components/ReportForm";
import ReportList from './components/ReportList';
import 'leaflet/dist/leaflet.css';
import ReportDetails from './components/ReportDetails';
import AdminLogin from "./components/AdminLogin";
import Home from './components/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>}/>
        <Route path="/report" element={<Layout><ReportForm /></Layout>} />
        <Route path='/reportList' element={<Layout><div><ReportList/></div></Layout>} />
        <Route path="/report/:id" element={<Layout><ReportDetails /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

