import { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ReportCard({ report }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
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
        setImageUrl("placeholder-image-url"); // fallback image
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [report.id]);

  return (
    <Card
      className="d-flex flex-column"
      style={{
        width: "100%",
        maxWidth: "18rem",
        height: "350px", // desktop fixed height
      }}
    >
      <div style={{ position: "relative" }}>
        {loadingImage ? (
                <div className="text-center my-3">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Card.Img
                  variant="top"
                  src={imageUrl}
                  style={{ height: "140px", objectFit: "cover" }}
                />
        )}
          <Badge
          bg="warning"
          style={{ color: "white",position: "absolute", top: "10px", right: "10px", padding: "0.5rem 0.75rem", fontSize: "0.6rem", borderRadius: "5px" }}
        >
          Pending
        </Badge>
      </div>
     

      <Card.Body
        className="d-flex flex-column"
        style={{ flex: "1 1 auto", padding: "0.75rem" }}
      >
        <Card.Title
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "1rem",
            marginBottom: "0.3rem",
          }}
        >
          {report.heading}
        </Card.Title>

        <Card.Text
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // show max 2 lines
            WebkitBoxOrient: "vertical",
            fontSize: "0.9rem",
            marginBottom: "0.3rem",
          }}
        >
          {report.description}
        </Card.Text>

        <Card.Text
          className="text-secondary"
          style={{
            fontSize: "0.8rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: "0.5rem",
          }}
        >
          {report.address}
        </Card.Text>

        <div style={{ marginTop: "auto" }}>
          <Button variant="warning" className="w-100" size="md" onClick={() => navigate(`/report/${report.id}`)}>
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ReportCard;
