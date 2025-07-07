import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Perfil actualizado');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '80vh' }}
    >
      <Helmet>
        <title>Perfil de Usuario</title>
      </Helmet>

      <div
        className="p-4 shadow-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '450px',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#eeeeee' }}>
          Mi&nbsp;
          <span style={{ color: '#D12B19' }}>Perfil</span>
        </h2>

        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label style={{ color: '#cccccc' }}>Nombre</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label style={{ color: '#cccccc' }}>
              Confirmar Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              disabled={loadingUpdate}
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
              {loadingUpdate ? 'Guardando...' : 'Actualizar'}
            </Button>
          </div>
        </Form>
      </div>

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
