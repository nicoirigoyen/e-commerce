import React, { useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Tooltip } from '@mui/material';
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

  // Renderizado simple de estrellas según rating
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
        boxShadow: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
      elevation={4}
    >
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'contain', bgcolor: '#fafafa' }}
        />
      </Link>
      <CardContent sx={{ flexGrow: 1 }}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <Typography variant="h6" component="div" gutterBottom sx={{ color: '#333', fontWeight: '700' }}>
            {product.name}
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {renderRating(product.rating)}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.numReviews})
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
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
            color="primary"
            startIcon={<ShoppingCartIcon />}
            fullWidth
            onClick={() => addToCartHandler(product)}
            sx={{
              textTransform: 'none',
              fontWeight: '700',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            Agregar al carrito
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Product;
