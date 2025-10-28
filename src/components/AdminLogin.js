import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { ShieldLock } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ React Router hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "https://safai-setu-admin.onrender.com/login", // Spring default endpoint
        new URLSearchParams({ username, password }),
        {
          withCredentials: true,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // ✅ store admin flag and redirect to home
      localStorage.setItem("isAdmin", "true");
      navigate("/"); // React handles navigation
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
        <div className="text-center mb-4">
          <ShieldLock size={48} color="green" />
          <h3 className="mt-2 text-success fw-bold">Admin Login</h3>
          <p className="text-muted small">Safai Setu Admin Panel</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid mt-4">
            <Button
              variant="success"
              type="submit"
              className="py-2 fw-semibold"
              disabled={loading}
              style={{ borderRadius: "12px" }}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Login"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminLogin;
