import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";

function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    verification: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          "https://safai-setu-backend.onrender.com/api/report"
        );

        const data = response.data;
        const total = data.length;
        const pending = data.filter((r) => r.status === "Pending").length;
        const verification = data.filter(
          (r) => r.status === "Pending Verification"
        ).length;
        const resolved = data.filter((r) => r.status === "Resolved").length;

        setMetrics({ total, pending, verification, resolved });
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <div style={{ marginTop: "100px" }}>
      <Container className="my-5">
        <Row className="g-4 justify-content-center align-items-stretch">
          <Col xs={6} md={3}>
            <Card className="text-center shadow-sm border-0 rounded-4 h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <h4 className="text-danger fw-bold">{metrics.total}</h4>
                <p className="text-muted mb-0">Total Reports</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3}>
            <Card className="text-center shadow-sm border-0 rounded-4 h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <h4 className="text-warning fw-bold">{metrics.pending}</h4>
                <p className="text-muted mb-0">Pending</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3}>
            <Card className="text-center shadow-sm border-0 rounded-4 h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <h4 className="text-info fw-bold">{metrics.verification}</h4>
                <p className="text-muted mb-0">Pending Verification</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={6} md={3}>
            <Card className="text-center shadow-sm border-0 rounded-4 h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <h4 className="text-success fw-bold">{metrics.resolved}</h4>
                <p className="text-muted mb-0">Resolved</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DashboardMetrics;
