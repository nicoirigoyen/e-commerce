import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import FeaturedSection from '../components/FeaturedSection';
import CategoryDropdown from '../components/CategoryDropdown';
import { FaWhatsapp } from 'react-icons/fa';

// MUI
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Fab,
  Paper,
} from '@mui/material';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
      <Helmet>
        <title>UpSeeBuy</title>
      </Helmet>

      {/* Categorías */}
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          p: 2,
          mb: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <CategoryDropdown />
        {['Garantías', 'Nuevo Ingreso', 'Oferta Flash!', 'Preorden', 'Contacto', 'Inicio'].map((text) => (
          <Button key={text} variant="outlined" color="primary">
            {text}
          </Button>
        ))}
      </Paper>

      {/* Destacados */}
      <FeaturedSection />

      {/* Productos */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Productos destacados
        </Typography>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.slug}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* WhatsApp */}
      <Fab
        color="success"
        aria-label="whatsapp"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={24} />
      </Fab>
    </Container>
  );
};

export default HomeScreen;
