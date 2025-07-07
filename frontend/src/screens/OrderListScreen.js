import React, { useContext, useEffect, useReducer } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Pedido eliminado');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Helmet>
        <title>Pedidos</title>
      </Helmet>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          bgcolor: '#1C2E48',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 0 12px rgba(0,255,255,0.15)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 'bold', color: '#58f0ff', textAlign: 'center' }}
        >
          Lista de Pedidos
        </Typography>

        {loadingDelete && (
          <Box textAlign="center" mb={2}>
            <CircularProgress color="error" />
          </Box>
        )}

        {loading ? (
          <Box textAlign="center">
            <CircularProgress color="info" />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: '#121e33' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID', 'Usuario', 'Fecha', 'Total', 'Pagado', 'Entregado', 'Acciones'].map(
                    (header) => (
                      <TableCell key={header} sx={{ color: '#58f0ff', fontWeight: 'bold' }}>
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ color: '#ccc' }}>{order._id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {order.user ? order.user.name : 'Usuario Eliminado'}
                    </TableCell>
                    <TableCell sx={{ color: '#ccc' }}>
                      {order.createdAt.substring(0, 10)}
                    </TableCell>
                    <TableCell sx={{ color: '#58f0ff' }}>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: order.isPaid ? '#25D366' : '#f44336' }}>
                      {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                    </TableCell>
                    <TableCell sx={{ color: order.isDelivered ? '#25D366' : '#f44336' }}>
                      {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteHandler(order)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
