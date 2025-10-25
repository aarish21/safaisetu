import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import ReportCard from './ReportCard';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('https://safai-setu-backend.onrender.com/api/report'); 
        // Expected response: [{id, heading, description}, ...]
        setReports(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center my-5">
        {error}
      </Alert>
    );

  return (
    <Container className="my-5 d-flex flex-wrap gap-4 justify-content-center">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </Container>
  );
}

export default ReportList;
