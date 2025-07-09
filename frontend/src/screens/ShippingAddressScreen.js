import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        color: '#eee',
        boxShadow: '0 0 10px rgba(0,255,255,0.1)',
      }}
    >
      <Helmet>
        <title>Dirección de Envío</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3" style={{ color: '#58f0ff' }}>Dirección de Envío</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ backgroundColor: '#1f2937', color: '#eee', border: 'none' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ backgroundColor: '#1f2937', color: '#eee', border: 'none' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{ backgroundColor: '#1f2937', color: '#eee', border: 'none' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              style={{ backgroundColor: '#1f2937', color: '#eee', border: 'none' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>País</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              style={{ backgroundColor: '#1f2937', color: '#eee', border: 'none' }}
            />
          </Form.Group>

          <div className="mb-3">
            <Button
              id="chooseOnMap"
              type="button"
              style={{
                backgroundColor: '#1E88E5',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => navigate('/map')}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.01)';
                e.target.style.backgroundColor = '#1565C0';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#1E88E5';
              }}
            >
              Seleccionar dirección en Google Maps
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <div>
                LAT: {shippingAddress.location.lat}
                LNG: {shippingAddress.location.lng}
              </div>
            ) : (
              <div>Sin dirección</div>
            )}
          </div>

          <div className="mb-3">
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: '#00c2ff',
                color: '#000',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
