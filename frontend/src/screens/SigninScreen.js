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

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post('/api/users/signin', {
        email: email.trim(),
        password: password.trim(),
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('accessToken', data.accessToken);
      document.cookie = `refreshToken=${data.refreshToken}; Secure; Path=/`;

      navigate(redirect);
    } catch (err) {
      toast.error(getError(err), { position: 'top-center' });
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Helmet>
        <title>Iniciar Sesión</title>
      </Helmet>

      <div
        className="p-4 shadow-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#eeeeee' }}>
          Bienvenido a <span style={{ color: '#D12B19' }}>NiTecno</span>
        </h2>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label style={{ color: '#cccccc' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label style={{ color: '#cccccc' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#254EDB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e3a8a';
              }}
            >
              Ingresar
            </Button>
          </div>

          <div className="text-center" style={{ color: '#bbb' }}>
            ¿No tenés cuenta?{' '}
            <Link to={`/signup?redirect=${redirect}`} style={{ color: '#D12B19' }}>
              Crear una cuenta
            </Link>
          </div>
        </Form>
      </div>

      {/* Animación simple */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}
