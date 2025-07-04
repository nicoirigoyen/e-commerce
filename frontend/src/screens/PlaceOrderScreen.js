import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

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
        <title>Vista previa del pedido</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h2 style={{ color: '#58f0ff' }} className="my-4">
        Vista previa del pedido
      </h2>
      <Row>
        <Col md={8}>
          {/* ENVÍO */}
          <Card className="mb-4 border-0" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Transporte</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Dirección:</strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping" className="text-neon">Editar</Link>
            </Card.Body>
          </Card>

          {/* PAGO */}
          <Card className="mb-4 border-0" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Pago</Card.Title>
              <Card.Text>
                <strong>Forma de pago:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment" className="text-neon">Editar</Link>
            </Card.Body>
          </Card>

          {/* PRODUCTOS */}
          <Card className="mb-4 border-0" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Productos</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item
                    key={item._id}
                    style={{ backgroundColor: '#1f2937', color: '#eee' }}
                  >
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                          style={{ maxWidth: '80px', marginRight: '10px' }}
                        />
                        <Link to={`/product/${item.slug}`} className="text-neon">
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart" className="text-neon">Editar</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* RESUMEN */}
        <Col md={4}>
          <Card className="border-0" style={{ backgroundColor: '#1f2937' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Resumen del pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Productos</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Transporte</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Interés</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827' }}>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                      style={{
                        backgroundColor: '#00c2ff',
                        color: '#000',
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                    >
                      Realizar pedido
                    </Button>
                  </div>
                  {loading && <LoadingBox />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
