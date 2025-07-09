import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => orderID);
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Pedido pagado');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) return navigate('/login');
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) dispatch({ type: 'PAY_RESET' });
      if (successDeliver) dispatch({ type: 'DELIVER_RESET' });
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'ARS' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Pedido entregado');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div style={{ color: '#eee' }}>
      <Helmet>
        <title>Pedido {orderId}</title>
      </Helmet>
      <h1 className="my-3">Pedido {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Transporte</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {order.shippingAddress.fullName} <br />
                <strong>Dirección:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
                {order.shippingAddress.location?.lat && (
                  <>
                    &nbsp;
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Ver en Google Maps
                    </a>
                  </>
                )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Entregado en {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">No entregado</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Pago</Card.Title>
              <Card.Text>
                <strong>Forma de pago:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Pagado el {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">No pagado</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3" style={{ backgroundColor: '#111827cc' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Productos</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
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
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3" style={{ backgroundColor: '#1f2937' }}>
            <Card.Body>
              <Card.Title style={{ color: '#58f0ff' }}>Resumen del pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Productos</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Transporte</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col>Impuesto</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#111827', color: '#eee' }}>
                  <Row>
                    <Col><strong>Total</strong></Col>
                    <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <ListGroup.Item style={{ backgroundColor: '#111827' }}>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    )}
                    {loadingPay && <LoadingBox />}
                  </ListGroup.Item>
                )}

                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item style={{ backgroundColor: '#111827' }}>
                    {loadingDeliver && <LoadingBox />}
                    <div className="d-grid">
                      <Button
                        type="button"
                        onClick={deliverOrderHandler}
                        style={{
                          backgroundColor: '#1E88E5',
                          color: '#fff',
                          fontWeight: 'bold',
                          borderRadius: '12px',
                          padding: '12px 20px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease-in-out',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.015)';
                          e.target.style.backgroundColor = '#1565C0';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.backgroundColor = '#1E88E5';
                        }}
                      >
                        Entregar pedido
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
