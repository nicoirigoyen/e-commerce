import React, { useContext } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';

export default function ProductCard({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Lo sentimos, el producto está agotado');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const renderRating = (rating) =>
    Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <StarIcon key={i} sx={{ color: '#ffc000', fontSize: 18 }} />
      ) : (
        <StarBorderIcon key={i} sx={{ color: '#ffc000', fontSize: 18 }} />
      )
    );

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(145deg, #152238, #1C2E48)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 0 18px rgba(240,192,64,0.12)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 0 25px rgba(240,192,64,0.5)',
        },
      }}
    >
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            height: 220,
            objectFit: 'contain',
            backgroundColor: '#152238',
            p: 2,
          }}
        />
      </Link>

      <CardContent sx={{ px: 2, pt: 1, pb: 0 }}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              lineHeight: 1.3,
              height: 48,
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {renderRating(product.rating)}
          <Typography variant="caption" sx={{ ml: 1, color: '#d4d4d4' }}>
            ({product.numReviews})
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{ color: '#f0c040', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          ${product.price}
        </Typography>
      </CardContent>

      <CardActions sx={{ mt: 'auto', p: 2, pt: 1, justifyContent: 'center' }}>
        {product.countInStock === 0 ? (
          <Button
            variant="contained"
            color="error"
            disabled
            fullWidth
            sx={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              textTransform: 'uppercase',
              py: 1,
            }}
          >
            Agotado
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            fullWidth
            startIcon={<ShoppingCartIcon sx={{ fontSize: 20 }} />}
            sx={{
              background: 'linear-gradient(90deg, #f0c040, #ff8c00)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              borderRadius: '12px',
              textTransform: 'uppercase',
              py: 1.1,
              letterSpacing: 0.8,
              fontFamily: 'Orbitron, sans-serif',
              boxShadow: '0 0 10px rgba(255, 140, 0, 0.5)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff9c23, #ffb347)',
                boxShadow: '0 0 20px rgba(255, 140, 0, 0.8)',
                transform: 'scale(1.04)',
              },
            }}
          >
            Agregar
          </Button>

        )}
      </CardActions>
    </Card>
  );
}
