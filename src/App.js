import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from "./components/Hero";
import Layout from "./components/Layout";
import ReportForm from "./components/ReportForm";
import ReportList from './components/ReportList';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Hero /></Layout>}/>
        <Route path="/report" element={<Layout><ReportForm /></Layout>} />
        <Route path='/reportList' element={<Layout><div><ReportList/></div></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

