import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect);
    } catch (err) {
      toast.error(getError(err), { position: 'top-center' });
    }
  };

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  return (
    <Container
      className="small-container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '80vh' }}
    >
      <Helmet>
        <title>Registrarse</title>
      </Helmet>

      <div
        className="p-4 shadow-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '420px',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#eeeeee' }}>
          Crear cuenta en <span style={{ color: '#D12B19' }}>NiTecno</span>
        </h2>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label style={{ color: '#cccccc' }}>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label style={{ color: '#cccccc' }}>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label style={{ color: '#cccccc' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label style={{ color: '#cccccc' }}>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <div className="d-grid mb-3">
            <Button
              type="submit"
              variant="primary"
              style={{
                backgroundColor: '#1e3a8a',
                border: 'none',
                fontWeight: '600',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#254EDB')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
            >
              Registrarse
            </Button>
          </div>

          <div className="text-center" style={{ color: '#bbb' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to={`/signin?redirect=${redirect}`} style={{ color: '#D12B19' }}>
              Iniciar sesión
            </Link>
          </div>
        </Form>
      </div>

      {/* Animación fadeIn */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}
