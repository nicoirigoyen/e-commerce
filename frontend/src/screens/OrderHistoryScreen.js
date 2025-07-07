import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a192f',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <Helmet>
        <title>Historial de Pedidos</title>
      </Helmet>

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#00fff7',
          textShadow: '0 0 8px #00fff7',
        }}
      >
        Historial de Pedidos
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: '#00fff7', mt: 3 }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 1100,
            mt: 3,
            backgroundColor: '#1c2737',
            border: '1px solid #00fff7',
            borderRadius: 2,
            boxShadow: '0 0 15px #00fff750',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#122033' }}>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>FECHA</TableCell>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>TOTAL</TableCell>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>PAGADO</TableCell>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>ENTREGADO</TableCell>
                <TableCell sx={{ color: '#58f0ff', fontWeight: 'bold' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#223348',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#e0e0e0' }}>{order._id}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>
                    {order.createdAt.substring(0, 10)}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: order.isPaid ? '#00e676' : '#ff1744' }}>
                    {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                  </TableCell>
                  <TableCell sx={{ color: order.isDelivered ? '#00e676' : '#ff1744' }}>
                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/order/${order._id}`)}
                      sx={{
                        color: '#00fff7',
                        '&:hover': {
                          color: '#58f0ff',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
