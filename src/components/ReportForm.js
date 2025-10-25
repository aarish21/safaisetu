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
    const fileInputRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // temporary preview
    }
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
      // prepare report object
      const report = { heading, description };

      // prepare multipart form data
      const formData = new FormData();
      formData.append('report', new Blob([JSON.stringify(report)], { type: 'application/json' }));
      formData.append('imageFile', image);

      // make API call
      const response = await axios.post('https://safai-setu-backend.onrender.com/api/report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Issue reported successfully!');
      console.log('Response:', response.data);

      // reset form
      setHeading('');
      setDescription('');
      setImage(null);
      setPreview(null);

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
