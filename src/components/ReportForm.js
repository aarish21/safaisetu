// src/components/ReportForm.js
import { useRef, useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Image,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { GeoAltFill } from "react-bootstrap-icons"; // 📍 React Bootstrap icon
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 📍 Custom map icon
const markerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🧭 Draggable marker component
function DraggableMarker({ location, setLocation }) {
  const markerRef = useRef(null);
  const map = useMap();

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      }
    },
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      map.setView([location.latitude, location.longitude], 15);
    }
  }, [location, map]);

  // Reverse geocode to update address
  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.display_name) {
            setLocation((prev) => ({
              ...prev,
              address: data.display_name,
            }));
          }
        })
        .catch((err) => console.error("Reverse geocode error:", err));
    }
  }, [location.latitude, location.longitude]);

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={[location.latitude, location.longitude]}
      icon={markerIcon}
      ref={markerRef}
    />
  );
}

function ReportForm() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Default location → Delhi
  const [location, setLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    address: "Delhi, India",
  });

  const fileInputRef = useRef();

  // Detect user’s location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Using default (Delhi).");
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please upload an image!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const report = { heading, description, ...location };

      const formData = new FormData();
      formData.append(
        "report",
        new Blob([JSON.stringify(report)], { type: "application/json" })
      );
      formData.append("imageFile", image);

      const response = await axios.post(
        "https://safai-setu-backend.onrender.com/api/report",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Issue reported successfully!");
      console.log("Response:", response.data);

      // Reset form
      setHeading("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        address: "Delhi, India",
      });

      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("❌ Failed to submit report. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="p-3 p-md-5"
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <h2 className="mb-4 text-center">Report an Issue</h2>

      <Form onSubmit={handleSubmit}>
        {/* Heading */}
        <Form.Group className="mb-3">
          <Form.Label>Heading</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Garbage dump on road"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Describe the issue</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Provide more details about the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        {/* Location */}
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Button
            variant="outline-secondary"
            size="sm"
            className="ms-2 mb-2 d-inline-flex align-items-center gap-2"
            onClick={getLocation}
            disabled={loading}
          >
            <GeoAltFill /> Detect My Location
          </Button>

          <Form.Control
            type="text"
            name="address"
            placeholder="Address (auto-filled, editable)"
            value={location.address}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, address: e.target.value }))
            }
            className="mb-2"
          />

          <Row>
            <Col>
              <Form.Text className="text-muted">
                <strong>Latitude:</strong> {location.latitude.toFixed(5)}
              </Form.Text>
            </Col>
            <Col>
              <Form.Text className="text-muted">
                <strong>Longitude:</strong> {location.longitude.toFixed(5)}
              </Form.Text>
            </Col>
          </Row>
        </Form.Group>

        {/* Map */}
        <div className="mb-4">
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            style={{ height: "300px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <DraggableMarker location={location} setLocation={setLocation} />
          </MapContainer>
          <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
            📍 Drag the marker to adjust location — address updates automatically.
          </p>
        </div>

        {/* Image upload */}
        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            ref={fileInputRef}
          />
        </Form.Group>

        {/* Preview */}
        {preview && (
          <div className="text-center mb-3">
            <Image
              src={preview}
              alt="Preview"
              thumbnail
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Submit button */}
        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>

      {/* Message */}
      {message && (
        <Alert
          variant={message.startsWith("✅") ? "success" : "danger"}
          className="mt-4 text-center"
        >
          {message}
        </Alert>
      )}
    </Container>
  );
}

export default ReportForm;
