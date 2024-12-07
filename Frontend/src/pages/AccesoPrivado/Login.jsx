/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

const FormLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('verificador');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        
        // Si el login es exitoso, redirige al dashboard correspondiente con el token
        if (role === 'admin') {
          navigate('/admin-dashboard', { 
            state: { token: data.token }
          });
        } else if (role === 'verificador') {
          navigate('/verificador-dashboard', {
            state: { token: data.token }
          });
        }
      } else {
        setError(data.msg || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al conectarse al servidor');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="login-form p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Iniciar sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </Form.Group>

          <Form.Group controlId="role" className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="verificador">Verificador</option>
              <option value="admin">Administrador</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" block>
            Iniciar sesión
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <p>No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </Container>
  );
};

export default FormLogin;
