// ProductScreen.jsx
import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Rating as MuiRating,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();
  const { slug } = useParams();

  const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        setSelectedImage(result.data.image);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Producto sin stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Por favor ingrese comentario y calificación');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Comentario enviado!');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({ behavior: 'smooth', top: reviewsRef.current.offsetTop });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant="danger">{error}</MessageBox>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto', color: '#f0f0f0' }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              background: 'radial-gradient(circle at center, #f0c04044 0%, transparent 70%)',
              borderRadius: 4,
              p: 2,
              mb: 2,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  borderRadius: 12,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                  objectFit: 'contain',
                  maxHeight: 480,
                }}
              />
            </AnimatePresence>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {[product.image, ...(product.images || [])].map((img) => (
              <Box
                key={img}
                onClick={() => setSelectedImage(img)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: selectedImage === img ? '2px solid #f0c040' : '2px solid #444',
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                }}
              >
                <img
                  src={img}
                  alt="thumb"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MuiRating value={product.rating} precision={0.5} readOnly sx={{ color: '#f0c040' }} />
            <Typography sx={{ ml: 1, color: '#ccc' }}>{product.numReviews} reseñas</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#f0c040', fontWeight: 'bold' }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography sx={{ mt: 2, color: '#ccc' }}>{product.description}</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              bgcolor: '#1a1a1a',
              border: '1px solid #555',
              color: '#f0f0f0',
              borderRadius: 3,
            }}
          >
            <Typography fontWeight="bold">Precio: ${product.price.toFixed(2)}</Typography>
            <Typography>
              Estado:{' '}
              {product.countInStock > 0 ? (
                <Chip label="En stock" sx={{ fontWeight: 'bold', background: '#f0c040', color: '#000' }} />
              ) : (
                <Chip label="Sin stock" color="error" sx={{ fontWeight: 'bold' }} />
              )}
            </Typography>
            <Button
              variant="contained"
              onClick={addToCartHandler}
              fullWidth
              disabled={product.countInStock === 0}
              sx={{
                mt: 2,
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
              {product.countInStock > 0 ? 'Agregar al carrito' : 'Sin stock'}
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" ref={reviewsRef}>
          Calificaciones
        </Typography>
        {product.reviews.length === 0 ? (
          <MessageBox>No hay calificaciones</MessageBox>
        ) : (
          product.reviews.map((review) => (
            <Card key={review._id} sx={{ my: 2, p: 2, background: '#2b2b2b', color: '#eee' }}>
              <Typography fontWeight="bold">{review.name}</Typography>
              <MuiRating value={review.rating} readOnly size="small" sx={{ color: '#f0c040' }} />
              <Typography variant="caption">{new Date(review.createdAt).toLocaleDateString()}</Typography>
              <Typography>{review.comment}</Typography>
            </Card>
          ))
        )}

        <Box sx={{ mt: 4 }}>
          {userInfo ? (
            <Box component="form" onSubmit={submitHandler}>
              <Typography fontWeight="600" mb={2}>
                Dejá tu reseña
              </Typography>
              <Select
                fullWidth
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                displayEmpty
                sx={{ mb: 2, background: '#1a1a1a', color: '#fff' }}
              >
                <MenuItem value="" disabled>
                  Seleccionar calificación
                </MenuItem>
                {[1, 2, 3, 4, 5].map((r) => (
                  <MenuItem key={r} value={r}>
                    {r} - {['Pobre', 'Malo', 'Bueno', 'Muy bueno', 'Excelente'][r - 1]}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                multiline
                fullWidth
                rows={4}
                placeholder="Escribe tu comentario"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  mb: 2,
                  background: '#1a1a1a',
                  input: { color: '#fff' },
                  '& .MuiInputBase-root': { color: '#fff' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loadingCreateReview}
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
                Enviar
              </Button>
            </Box>
          ) : (
            <MessageBox>
              Por favor <Link to={`/signin?redirect=/product/${product.slug}`}>inicia sesión</Link> para comentar.
            </MessageBox>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductScreen;
