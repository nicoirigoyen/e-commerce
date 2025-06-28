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

import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Fab,
  Paper,
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
        <title>UpSeeBuy</title>
      </Helmet>

      {/* Categorías */}
      <Fade in timeout={800}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            p: 2,
            mb: 4,
            bgcolor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          <CategoryDropdown />
          {['Garantías', 'Nuevo Ingreso', 'Oferta Flash!', 'Preorden', 'Contacto', 'Inicio'].map((text) => (
            <Button
              key={text}
              variant="outlined"
              color="primary"
              sx={{
                m: 1,
                borderColor: '#6B8DD6',
                color: '#6B8DD6',
                fontWeight: '600',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#6B8DD6',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                },
              }}
            >
              {text}
            </Button>
          ))}
        </Paper>
      </Fade>

      {/* Sección destacada */}
      <Fade in timeout={1000}>
        <Box>
          <FeaturedSection />
        </Box>
      </Fade>

      {/* Productos */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
          }}
        >
          Productos destacados
        </Typography>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.slug}>
                <Grow in timeout={500 + index * 200}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'scale(1.04)',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                        border: '1px solid #6B8DD6',
                      },
                    }}
                  >
                    <Product product={product} />
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
