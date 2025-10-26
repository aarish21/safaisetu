import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Spinner, Badge, Button } from "react-bootstrap";
import axios from "axios";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `https://safai-setu-backend.onrender.com/api/report/${id}`
        );
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (!report?.id) return;
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://safai-setu-backend.onrender.com/api/report/${report.id}/image`,
          { responseType: "blob" }
        );
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image for report:", report.id, error);
        setImageUrl("https://via.placeholder.com/800x600?text=No+Image");
      } finally {
        setLoadingImage(false);
      }
    };
    fetchImage();
  }, [report]);

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!report) {
    return (
      <Container fluid className="text-center py-5">
        <h5>Report not found</h5>
        <Button variant="success" onClick={() => navigate("/")}>
          Back to Reports
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3" >
      <Row className="g-0" style={{ minHeight: "90vh", }}>
        {/* Image Section */}
        <Col
        md={6}
        className="d-flex align-items-center justify-content-center bg-light p-3"
        style={{ minHeight: "400px" }}
        >
        {loadingImage ? (
            <Spinner animation="border" variant="success" />
        ) : (
            <Image
            src={imageUrl}
            alt="Report"
            fluid
            rounded
            style={{
                width: "100%",
                height: "80vh",
                objectFit: "cover",
                borderRadius: "1rem", // rounded corners
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // subtle shadow
            }}
            />
        )}
        </Col>


        {/* Details Section */}
        <Col
          md={6}
          className="d-flex flex-column justify-content-center p-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h2 className="text-success mb-4">{report.title || "Report Details"}</h2>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Location:</strong> {report.address}</p>
          <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge bg={report.status === "Resolved" ? "success" : "warning"}>
              {report.status || "Pending"}
            </Badge>
          </p>

          <Button variant="success" onClick={() => navigate(-1)} className="mt-3">
            ← Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportDetails;
