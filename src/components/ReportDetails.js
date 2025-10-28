import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Spinner,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
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
    const fetchImages = async () => {
      try {
        const [reportImg, resolvedImg] = await Promise.all([
          axios.get(
            `https://safai-setu-backend.onrender.com/api/report/${report.id}/image`,
            { responseType: "blob" }
          ),
          axios
            .get(
              `https://safai-setu-backend.onrender.com/api/report/${report.id}/resolved-image`,
              { responseType: "blob" }
            )
            .catch(() => null),
        ]);

        setImageUrl(URL.createObjectURL(reportImg.data));
        if (resolvedImg) {
          setResolvedImageUrl(URL.createObjectURL(resolvedImg.data));
        }
      } catch (error) {
        console.error("Error fetching report images:", error);
        setImageUrl("https://via.placeholder.com/800x600?text=No+Image");
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImages();
  }, [report]);

  const handleMarkResolved = async () => {
    if (!file) {
      alert("Please upload a photo proof.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setSubmitting(true);
    try {
      await axios.put(
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
      className="py-4 px-4 mb-5 mt-5 pb-5 mt-3 rounded-4 shadow-sm bg-white"
      style={{ maxWidth: "1000px"}}
    >
      {/* ======= IMAGE SECTION ======= */}
      <Row className="g-3 justify-content-center align-items-center text-center">
        <Col xs={12} md={report.status === "Resolved" ? 6 : 8}>
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

        {report.status === "Resolved" && resolvedImageUrl && (
          <Col xs={12} md={6}>
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

      {/* ======= DETAILS SECTION ======= */}
      <Row className="justify-content-center mt-4 text-start">
        <Col xs={12} md={10}>
          <h2 className="text-success mb-3 text-center">
            {report.heading || "Report Details"}
          </h2>
          <p>
            <strong>Description:</strong> {report.description}
          </p>
          <p>
            <strong>Location:</strong> {report.address}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(report.date).toLocaleDateString()}
          </p>
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

          {/* Map */}
          {report.latitude && report.longitude && (
            <>
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[report.latitude, report.longitude]}
                    icon={markerIcon}
                  >
                    <Popup>
                      {report.heading} <br /> {report.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <Button
                variant="outline-success"
                href={`https://maps.google.com/?q=${report.latitude},${report.longitude}`}
                target="_blank"
                className="mt-3"
              >
                Open in Maps
              </Button>
            </>
          )}

          {/* ======= ACTIONS ======= */}
          {report.status === "Pending" && (
            <>
              <Form.Group controlId="resolvedPhoto" className="mt-4">
                <Form.Label>Upload Photo Proof</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Form.Group>

              {/* Button Row */}
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="danger"
                  onClick={handleMarkResolved}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Mark as Resolved"}
                </Button>

                <Button
                  variant="success"
                  onClick={() => navigate(-1)}
                  className="px-4"
                >
                  ← Back
                </Button>
              </div>
            </>
          )}

          {/* Admin Verification */}
          {localStorage.getItem("isAdmin") === "true" &&
            report.status === "Pending Verification" && (
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="success"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `https://safai-setu-admin.onrender.com/api/admin/verify/${report.id}`,
                        {},
                        { withCredentials: true }
                      );
                      alert("Report verified as resolved!");
                      setReport({ ...report, status: "Resolved" });
                    } catch (err) {
                      console.error(err);
                      alert(
                        "❌ Error verifying report — maybe not logged in as admin"
                      );
                    }
                  }}
                >
                  ✅ Verify as Admin
                </Button>

                <Button
                  variant="success"
                  onClick={() => navigate(-1)}
                  className="px-4"
                >
                  ← Back
                </Button>
              </div>
            )}
            {report.status === "Resolved" && (
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button
                        variant="success"
                        onClick={() => navigate(-1)}
                        className="px-4"
                        >
                        ← Back
                    </Button>
                </div>
            )}
          {report.status === "Pending Verification" && (
            <p className="text-info mt-3 text-center">
              🕒 Report resolved by user — pending admin verification.
            </p>
          )}

          {report.status === "Resolved" && (
            <p className="text-success mt-3 text-center">
              ✅ This issue has been verified and marked as resolved by admin.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ReportDetails;
