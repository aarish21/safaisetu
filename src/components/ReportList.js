import { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import ReportCard from './ReportCard';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('https://safai-setu-backend.onrender.com/api/report');
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Apply both search and status filters
  useEffect(() => {
    let filtered = [...reports];

    // Filter by location (address)
    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

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
    <Container className="my-5 pb-5">
      {/* ======= SEARCH + FILTER SECTION ======= */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8}>
          <Form className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-center">
            <Form.Control
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-100"
            />

            <ButtonGroup className="mt-2 mt-md-0">
              <Button
                variant={statusFilter === 'All' ? 'success' : 'outline-success'}
                onClick={() => setStatusFilter('All')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'Pending' ? 'success' : 'outline-success'}
                onClick={() => setStatusFilter('Pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'Pending Verification' ? 'success' : 'outline-success'}
                onClick={() => setStatusFilter('Pending Verification')}
              >
                Verification
              </Button>
              <Button
                variant={statusFilter === 'Resolved' ? 'success' : 'outline-success'}
                onClick={() => setStatusFilter('Resolved')}
              >
                Resolved
              </Button>
            </ButtonGroup>
          </Form>
        </Col>
      </Row>

      {/* ======= REPORT CARDS ======= */}
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        ) : (
          <p className="text-muted mt-4">No reports found matching your filters.</p>
        )}
      </div>
    </Container>
  );
}

export default ReportList;
