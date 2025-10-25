// src/components/Navbar.js
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import logo from '../assets/safai-setu.png'; // adjust the path according to your project structure

function MyNavbar() {
  return (
    <Navbar expand="lg" bg="white" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Image 
            src={logo} 
            alt="Safai Setu Logo" 
            roundedCircle 
            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '1px' }}
          />
          Safai Setu
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/reportList">View Reports</Nav.Link>
            <Nav.Link href="#help">Help</Nav.Link>
            <Button variant="outline-dark" className="mx-2">Login</Button>
            <Button variant="warning">Sign Up</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
