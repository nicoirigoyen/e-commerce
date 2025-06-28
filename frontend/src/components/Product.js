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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';

function Product({ product }) {
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
        <StarIcon key={i} sx={{ color: '#fbc02d' }} />
      ) : (
        <StarBorderIcon key={i} sx={{ color: '#fbc02d' }} />
      )
    );
  };

  return (
    <Card
      sx={{
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        bgcolor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          border: '1px solid #6B8DD6',
        },
      }}
      elevation={0}
    >
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain', bgcolor: 'rgba(250,250,250,0.1)' }}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1 }}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#f0f0f0', fontWeight: 700 }}>
            {product.name}
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {renderRating(product.rating)}
          <Typography variant="body2" sx={{ ml: 1, color: '#ccc' }}>
            ({product.numReviews})
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: '#81c784', fontWeight: 'bold' }}>
          ${product.price}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        {product.countInStock === 0 ? (
          <Tooltip title="Producto agotado">
            <span>
              <Button variant="contained" color="error" disabled startIcon={<ShoppingCartIcon />} fullWidth>
                Agotado
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6B8DD6',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#5477c2',
              },
            }}
            startIcon={<ShoppingCartIcon />}
            fullWidth
            onClick={() => addToCartHandler(product)}
          >
            Agregar al carrito
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Product;
