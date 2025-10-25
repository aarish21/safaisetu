// src/components/ReportForm.js
import { useRef, useState } from 'react';
import { Container, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

function ReportForm() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [heading, setHeading] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧭 Location state
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });

  const fileInputRef = useRef();

  // 🧭 Function to detect location automatically
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLocation((prev) => ({ ...prev, latitude: lat, longitude: lon }));

          try {
            // Reverse geocoding API (OpenStreetMap)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();
            setLocation((prev) => ({
              ...prev,
              address: data.display_name || ''
            }));
          } catch (err) {
            console.error('Error fetching address:', err);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to fetch location. Please allow access or enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please upload an image!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Prepare report object
      const report = { heading, description, ...location };

      // Prepare multipart form data
      const formData = new FormData();
      formData.append('report', new Blob([JSON.stringify(report)], { type: 'application/json' }));
      formData.append('imageFile', image);

      // API call
      const response = await axios.post('https://safai-setu-backend.onrender.com/api/report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Issue reported successfully!');
      console.log('Response:', response.data);

      // Reset form
      setHeading('');
      setDescription('');
      setImage(null);
      setPreview(null);
      setLocation({ latitude: '', longitude: '', address: '' });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage('❌ Failed to submit report. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ padding: '50px 0', maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">Report an Issue</h2>

      <Form onSubmit={handleSubmit}>
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

        {/* 🧭 Location Fields */}
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Button
            variant="secondary"
            size="sm"
            className="ms-2 mb-2"
            onClick={getLocation}
            disabled={loading}
          >
            Detect Location
          </Button>

          <Form.Control
            type="text"
            name="address"
            placeholder="Address (editable)"
            value={location.address}
            onChange={handleChange}
            className="mb-2"
            required
          />
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={location.latitude}
              onChange={handleChange}
            />
            <Form.Control
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={location.longitude}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

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

        {preview && (
          <div className="text-center mb-3">
            <Image
              src={preview}
              alt="Preview"
              thumbnail
              style={{ maxHeight: '250px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" /> Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </Form>

      {message && (
        <Alert
          variant={message.startsWith('✅') ? 'success' : 'danger'}
          className="mt-4 text-center"
        >
          {message}
        </Alert>
      )}
    </Container>
  );
}

export default ReportForm;
