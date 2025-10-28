import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from "./components/Hero";
import Layout from "./components/Layout";
import ReportForm from "./components/ReportForm";
import ReportList from './components/ReportList';
import 'leaflet/dist/leaflet.css';
import ReportDetails from './components/ReportDetails';
import AdminLogin from "./components/AdminLogin";
import { Navigate } from "react-router-dom";
import AdminDashboard from './components/AdminDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Hero /></Layout>}/>
        <Route path="/report" element={<Layout><ReportForm /></Layout>} />
        <Route path='/reportList' element={<Layout><div><ReportList/></div></Layout>} />
        <Route path="/report/:id" element={<Layout><ReportDetails /></Layout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              localStorage.getItem("isAdmin") ? (
                <Layout><AdminDashboard /></Layout>
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
      </Routes>
    </Router>
  );
}

export default App;

