import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Card,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MessageBox from '../components/MessageBox';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateCartHandler = async (item, quantity) => {
    if (quantity < 1) return;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, margin: 'auto' }}>
    <Helmet>
        <title>Carrito de compras</title>
    </Helmet>
    <Typography
      variant="h4"
      fontWeight="700"
      mb={3}
      textAlign="center"
      sx={{
        fontFamily: "'Poppins', sans-serif", // letra moderna, fácil de usar con Google Fonts
        animation: `${fadeIn} 0.8s ease forwards`,
        color: '#1976d2', // azul moderno, cambia si querés
      }}
    >
      Carrito de compras
    </Typography>

      <Grid container spacing={4}>
        {/* Lista de productos */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Carrito vacío. <Link to="/">Ir a comprar</Link>
            </MessageBox>
          ) : (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {cartItems.map((item) => (
                <Card
                  key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    gap: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    ':hover': { boxShadow: 6 },
                  }}
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                >
                  <Box
                    component={Link}
                    to={`/product/${item.slug}`}
                    sx={{
                      width: 90,
                      height: 90,
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: 'hidden',
                      display: 'block',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      component={Link}
                      to={`/product/${item.slug}`}
                      variant="subtitle1"
                      fontWeight="600"
                      color="text.primary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { color: theme.palette.primary.main },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <IconButton
                        aria-label="reduce quantity"
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        aria-label="increase quantity"
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>

                      <Box sx={{ flexGrow: 1 }} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ minWidth: 75, textAlign: 'right' }}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>

                      <IconButton
                        aria-label="remove item"
                        onClick={() => removeItemHandler(item)}
                        color="error"
                        size={isMobile ? 'small' : 'medium'}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Resumen y botones */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              position: 'sticky',
              top: 80,
              boxShadow: 4,
              borderRadius: 3,
              backgroundColor: 'background.paper',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2} textAlign="right">
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items):
              <Box component="span" color={theme.palette.primary.main} ml={1}>
                ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
              </Box>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              sx={{ mb: 2 }}
            >
              Ir a pagar
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Transferencia / Efectivo
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
