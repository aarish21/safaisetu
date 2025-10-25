// src/components/Hero.js
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/safai-setu.png';
import { Image } from 'react-bootstrap';
function Hero() {
    const navigate = useNavigate();
  return (
    <div style={{
      background: 'linear-gradient(135deg, #d7aa25ff, #448fadff)',
      color: 'white',
      padding: '100px 0',
      textAlign: 'center'
    }}>
      <Container>
        <Image
          src={logo}
          alt="Safai Setu Logo"
          roundedCircle
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            marginBottom: '20px',
          }}
        />
        <h1 className="fw-bold display-4">
          Safai Setu <br/>Your Bridge to a Cleaner City and a Cleaner India
        </h1>
        <p className="lead mt-3 mb-5">
          Join the movement to keep our city clean. Report garbage, road issues and any other Public Grievances
        </p>
        <div>
          <Button 
            variant="warning" 
            size="lg" 
            className="me-3"
            onClick={() => navigate('/report')}
          >
            Report an Issue
          </Button>
        <Button 
          variant="light" 
          size="lg"
          onClick={() => navigate('/reportList')}
        >
            View Reports
        </Button>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
