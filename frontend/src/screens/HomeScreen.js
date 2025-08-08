import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import logger from 'use-reducer-logger';
import ProductCard from '../components/ProductCard';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import FeaturedSection from '../components/FeaturedSection';
import CategoryDropdown from '../components/CategoryDropdown';
import { FaWhatsapp } from 'react-icons/fa';

import {
  Container,
  Typography,
  Box,
  Grid,
  Fab,
  Fade,
  Grow,
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
        <title>NiTecno</title>
      </Helmet>

      {/* Sección de Novedades o Promos */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              letterSpacing: 1,
              textShadow: '0 0 10pxrgb(255, 115, 72)',
              mb: 2,
            }}
          >
            Novedades y Promos
          </Typography>
          <FeaturedSection />
        </Box>
      </Fade>
      
      {/* Productos destacados */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
            mb: 2,
          }}
        >
          Productos destacados
        </Typography>

       {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
              }}
            >
              <LoadingBox size={60} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <MessageBox variant="danger" sx={{ mb: 2 }}>
                {error}
              </MessageBox>
              <Fab
                variant="extended"
                color="primary"
                onClick={() => window.location.reload()}
                sx={{ cursor: 'pointer' }}
              >
                Reintentar
              </Fab>
            </Box>
          ) : !Array.isArray(products) || products.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                color: '#ccc',
                fontStyle: 'italic',
                py: 10,
                userSelect: 'none',
              }}
            >
              No hay productos disponibles en este momento.<br />
              Volvé más tarde 😊
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.slug}>
                  <Grow in timeout={500 + index * 150}>
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <ProductCard product={product} />
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}

      </Box>

      {/* WhatsApp flotante */}
      <Fab
        color="success"
        aria-label="whatsapp"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          animation: 'pulse 2000ms infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
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
