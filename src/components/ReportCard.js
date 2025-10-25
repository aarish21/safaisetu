import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

function ReportCard({ report }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://safai-setu-backend.onrender.com/api/report/${report.id}/image`,
          { responseType: 'blob' } // fetch image as blob
        );
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image for report:', report.id, error);
        setImageUrl('placeholder-image-url'); // fallback image
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [report.id]);

  return (
    <Card style={{ width: '18rem' }}>
      {loadingImage ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card.Img
          variant="top"
          src={imageUrl}
          style={{ height: '180px', objectFit: 'cover' }}
        />
      )}
      <Card.Body>
        <Card.Title>{report.heading}</Card.Title>
        <Card.Text>{report.description}</Card.Text>
        <Button variant="primary">View Details</Button>
      </Card.Body>
    </Card>
  );
}

export default ReportCard;
