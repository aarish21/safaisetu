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
  const [resolvedImageUrl, setResolvedImageUrl] = useState("");
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

//resolved-image
  useEffect(() => {
    if (!report?.id) return;
    const fetchResolvedImage = async () => {
      try {
        const response = await axios.get(
          `https://safai-setu-backend.onrender.com/api/report/${report.id}/resolved-image`,
          { responseType: "blob" }
        );
        setResolvedImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image for report:", report.id, error);
        setResolvedImageUrl("https://via.placeholder.com/800x600?text=No+Image");
      } finally {
        setLoadingImage(false);
      }
    };
    fetchResolvedImage();
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
      alert("Submitted for verification!");
      setReport({ ...report, status: "Pending Verification" });
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
  <Container
    fluid
    className="py-4 d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
  >
    <div
      className="shadow-sm rounded-4 p-3 bg-white w-100"
      style={{ maxWidth: "1100px" }}
    >
      <Row className="g-4 justify-content-center">

        {/* ===== IMAGE SECTION ===== */}
        {/* ===== IMAGE SECTION ===== */}
<Col xs={12}>
  <Row className="g-3 justify-content-center">
    {/* Reported Image */}
    <Col xs={12} md={6} className="text-center">
      <h6 className="text-success mb-2">Reported Image</h6>
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
            height: "350px",
            objectFit: "cover",
            borderRadius: "1rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        />
      )}
    </Col>

    {/* Resolved Image (only if status is Resolved) */}
    {report.status === "Resolved" && (
      <Col xs={12} md={6} className="text-center">
        <h6 className="text-success mb-2">Resolved Image</h6>
        {loadingImage ? (
          <Spinner animation="border" variant="success" />
        ) : (
          <Image
            src={resolvedImageUrl}
            alt="Resolved Report"
            fluid
            rounded
            style={{
              width: "100%",
              height: "350px",
              objectFit: "cover",
              borderRadius: "1rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          />
        )}
      </Col>
    )}
  </Row>
</Col>


        {/* ===== DETAILS SECTION ===== */}
        <Col
          xs={12}
          className="d-flex flex-column align-items-center text-center px-4 pt-3 pb-4"
        >
          <h3 className="text-success fw-bold mb-3">
            {report.heading || "Report Details"}
          </h3>
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

          {/* Buttons, Map, etc. remain same */}
          <div className="mt-3 w-100 d-flex flex-column align-items-center">
            {report.latitude && report.longitude && (
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  maxWidth: "600px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                }}
              >
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[report.latitude, report.longitude]} icon={markerIcon}>
                    <Popup>
                      {report.heading} <br /> {report.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3">
              <Button
                variant="outline-success"
                href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                target="_blank"
                className="me-2"
              >
                Open in Maps
              </Button>
              <Button
                variant="success"
                onClick={() => navigate(-1)}
                className="mt-2 mt-md-0"
              >
                ← Back
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </Container>
);

}

export default ReportDetails;
