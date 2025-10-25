// src/components/Footer.js
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',  // light background
      color: '#555',                // subtle text color
      padding: '20px 0',
      textAlign: 'center',
      fontSize: '14px'
    }}>
      <Container>
        <Row>
          <Col>
            <p>© {new Date().getFullYear()} Safai Setu | Made for a Cleaner India</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
