import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Spinner, Badge, Button, Form } from "react-bootstrap";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const markerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Fetch report details
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

  // Fetch image once report is loaded
  useEffect(() => {
    if (!report?.id) return;
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://safai-setu-backend.onrender.com/api/report/${report.id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image for report:", report.id, error);
        setImageUrl("https://via.placeholder.com/800x600?text=No+Image");
      } finally {
        setLoadingImage(false);
      }
    };
    fetchImage();
  }, [report]);

  // Handle "Mark as Resolved"
  const handleMarkResolved = async () => {
    if (!file) {
      alert("Please upload a photo proof.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setSubmitting(true);
    try {
      const response = await axios.put(
        `https://safai-setu-backend.onrender.com/api/report/${report.id}/resolve`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setReport(response.data); // Update report state
      alert("Submitted for verification!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Error submitting report.");
    } finally {
      setSubmitting(false);
    }
  };

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
    <Container fluid className="py-3">
      <Row className="g-0" style={{ minHeight: "90vh" }}>
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
                borderRadius: "1rem",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
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
          <h2 className="text-success mb-4">{report.heading || "Report Details"}</h2>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Location:</strong> {report.address}</p>
          <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              bg={
                report.status === "Resolved"
                  ? "success"
                  : report.status === "Pending Verification"
                  ? "info"
                  : "warning"
              }
            >
              {report.status || "Pending"}
            </Badge>
          </p>

          {/* Map Section */}
          {report.latitude && report.longitude && (
            <div
              style={{
                height: "300px",
                marginTop: "20px",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              }}
            >
              <MapContainer
                center={[report.latitude, report.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[report.latitude, report.longitude]} icon={markerIcon}>
                  <Popup>
                    {report.title} <br /> {report.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
          {report.latitude && report.longitude && (
            <Button
              variant="outline-success"
              href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
              target="_blank"
              className="mt-3"
            >
              Open in Maps
            </Button>
          )}

          {/* Mark as Resolved Section */}
            {report.status === "Pending" && (
            <>
                <Form.Group controlId="resolvedPhoto" className="mt-3">
                <Form.Label>Upload Photo Proof</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                </Form.Group>
                <Button
                variant="danger"
                onClick={handleMarkResolved}
                disabled={submitting}
                className="mt-2"
                >
                {submitting ? "Submitting..." : "Mark as Resolved"}
                </Button>
            </>
            )}

            {report.status === "Pending Verification" && (
            <p className="text-info mt-3">
                ✅ Report resolved by user — pending admin verification.
            </p>
            )}

            {report.status === "Resolved" && (
            <p className="text-success mt-3">
                ✅ This issue has been resolved and verified.
            </p>
            )}


          <Button variant="success" onClick={() => navigate(-1)} className="mt-3">
            ← Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportDetails;
