import React, { useContext } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Tooltip,
  IconButton,
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
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const renderRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <StarIcon key={i} sx={{ color: '#00ffc8', fontSize: 20 }} />
      ) : (
        <StarBorderIcon key={i} sx={{ color: '#00ffc8', fontSize: 20 }} />
      )
    );
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(145deg, #111927, #0a0f1f)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 0 15px rgba(0,255,204,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 0 20px #00ffc3',
        },
      }}
    >
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            height: 200,
            objectFit: 'contain',
            backgroundColor: '#111',
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
              fontWeight: '600',
              fontSize: '1rem',
              lineHeight: 1.2,
              height: 50,
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {renderRating(product.rating)}
          <Typography variant="caption" sx={{ ml: 1, color: '#bbb' }}>
            ({product.numReviews})
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: '#00ffc3',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          ${product.price}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          mt: 'auto',
          p: 2,
          pt: 1,
          justifyContent: 'center',
        }}
      >
        {product.countInStock === 0 ? (
          <Button
            variant="contained"
            color="error"
            disabled
            fullWidth
            sx={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRadius: '8px',
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
              background: 'linear-gradient(90deg, #00eaff 0%, #00ff95 100%)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              borderRadius: '8px',
              textTransform: 'uppercase',
              py: 1,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(90deg, #00c2f5 0%, #00e59b 100%)',
                boxShadow: '0 0 15px #00eaff',
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
