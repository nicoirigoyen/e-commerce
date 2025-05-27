import React, { useContext } from 'react';

import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Slide,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Delete } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    if (quantity < 1) return; // no permitir cantidad < 1
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      alert('Lo siento, producto sin stock suficiente');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>Carrito de compras</title>
      </Helmet>

      <Typography
        variant="h4"
        fontWeight="700"
        mb={4}
        textAlign="center"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          color: '#1976d2',
          animation: 'fadeInDown 0.8s ease forwards',
          '@keyframes fadeInDown': {
            '0%': { opacity: 0, transform: 'translateY(-20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        Carrito de compras
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          Carrito vacío.{' '}
          <Link to="/" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: '600' }}>
            Ir a comprar
          </Link>
        </Typography>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <List sx={{ bgcolor: 'transparent', p: 0 }}>
              {cartItems.map((item, index) => (
                <Slide
                  direction="up"
                  in={true}
                  mountOnEnter
                  unmountOnExit
                  timeout={300 + index * 100}
                  key={item._id}
                >
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => removeItemHandler(item)}
                        color="error"
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    }
                    alignItems="center"
                    sx={{
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)', // fondo semitransparente
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(8px)', // efecto blur para “flotante”
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        transform: 'scale(1.03)',
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 96, height: 96, mr: 2 }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Link
                          to={`/product/${item.slug}`}
                          style={{
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = '#115293')}
                          onMouseLeave={(e) => (e.target.style.color = '#1976d2')}
                        >
                          {item.name}
                        </Link>
                      }
                      secondary={
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                            disabled={item.quantity === 1}
                          >
                            <RemoveCircleOutline fontSize="small" />
                          </IconButton>

                          <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                            disabled={item.quantity === item.countInStock}
                          >
                            <AddCircleOutline fontSize="small" />
                          </IconButton>

                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            sx={{ marginLeft: 'auto', fontSize: '1.1rem' }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Slide>
              ))}
            </List>
          </Grid>



        <Grid item xs={12} md={4}>
  <Card
    sx={{
      p: 2,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      borderRadius: 3,
      bgcolor: 'rgba(255, 255, 255, 0.12)', // blanco translúcido
      backdropFilter: 'blur(10px)',         // blur para efecto cristal
      border: '1px solid rgba(255, 255, 255, 0.18)', // borde difuso
      maxWidth: 360,
      margin: 'auto',
      color: 'white',                       // texto blanco para contraste
      height: 'auto',
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        textAlign="right"
        sx={{ letterSpacing: '0.03em', color: 'white' }}
      >
        Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}) :{' '}
        <Box
          component="span"
          sx={{
            color: '#90caf9', // azul claro para destacar
            fontSize: '1.3rem',
            fontWeight: 900,
            ml: 1,
            fontFamily: '"Roboto Mono", monospace',
          }}
        >
          ${totalPrice.toFixed(2)}
        </Box>
      </Typography>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="medium"
        onClick={checkoutHandler}
        disabled={cartItems.length === 0}
        sx={{
          mt: 3,
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 4px 15px rgb(25 118 210 / 0.7)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#115293',
            boxShadow: '0 6px 20px rgb(17 82 147 / 0.8)',
            transform: 'scale(1.05)',
          },
        }}
      >
        Ir a pagar
      </Button>
    </CardContent>
  </Card>
</Grid>



        </Grid>
      )}
    </Box>
  );
}
