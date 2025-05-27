import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
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
        setSelectedImage(result.data.image); // Imagen principal
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
      <Grid container spacing={5}>
        {/* Imagen principal */}
        <Grid item xs={12} md={6}>
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
                userSelect: 'none',
              }}
            />
          </AnimatePresence>
          {/* Thumbnails */}
          <Box
            sx={{
              display: 'flex',
              mt: 3,
              gap: 2,
              overflowX: 'auto',
              paddingBottom: 1,
            }}
          >
            {[product.image, ...(product.images || [])].map((img) => (
              <motion.div
                key={img}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: 'pointer',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow:
                    selectedImage === img
                      ? '0 0 10px 3px #1976d2'
                      : '0 2px 8px rgba(0,0,0,0.12)',
                  border: selectedImage === img ? '3px solid #1976d2' : '2px solid transparent',
                  flexShrink: 0,
                  width: 90,
                  height: 90,
                }}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt="thumbnail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: 10,
                  }}
                  draggable={false}
                />
              </motion.div>
            ))}
          </Box>
        </Grid>

        {/* Info producto */}
        <Grid item xs={12} md={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MuiRating value={product.rating} precision={0.5} readOnly size="medium" />
            <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
              {product.numReviews} reseñas
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" fontWeight="700" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
            {product.description}
          </Typography>
        </Grid>

        {/* Comprar */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.15)',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="600">
              Precio: ${product.price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="600">
                Estado:
              </Typography>
              {product.countInStock > 0 ? (
                <Chip
                  label="En stock"
                  color="success"
                  size="medium"
                  sx={{ fontWeight: 'bold', px: 2 }}
                />
              ) : (
                <Chip
                  label="No disponible"
                  color="error"
                  size="medium"
                  sx={{ fontWeight: 'bold', px: 2 }}
                />
              )}
            </Box>
            {product.countInStock > 0 ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={addToCartHandler}
                  sx={{ mt: 1, fontWeight: 'bold', borderRadius: 3 }}
                >
                  Agregar al carrito
                </Button>
              </motion.div>
            ) : (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="large"
                disabled
                sx={{ mt: 1, fontWeight: 'bold', borderRadius: 3 }}
              >
                Sin stock
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Reseñas */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="700" gutterBottom ref={reviewsRef}>
          Calificaciones
        </Typography>
        {product.reviews.length === 0 ? (
          <MessageBox>No hay calificaciones</MessageBox>
        ) : (
          product.reviews.map((review) => (
            <Card
              key={review._id}
              sx={{
                mb: 2,
                p: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                borderRadius: 3,
              }}
            >
              <Typography fontWeight="bold" variant="subtitle1">
                {review.name}
              </Typography>
              <MuiRating value={review.rating} readOnly precision={0.5} size="small" />
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {review.comment}
              </Typography>
            </Card>
          ))
        )}

        {/* Formulario para comentar */}
        <Box sx={{ mt: 4 }}>
          {userInfo ? (
            <Box component="form" onSubmit={submitHandler} noValidate>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Escribe un comentario del producto
              </Typography>
              <Select
                fullWidth
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                displayEmpty
                sx={{ mb: 2 }}
                size="small"
              >
                <MenuItem value="" disabled>
                  Seleccionar calificación
                </MenuItem>
                {[1, 2, 3, 4, 5].map((val) => (
                  <MenuItem key={val} value={val}>
                    {val} - {['Pobre', 'Malo', 'Bueno', 'Muy bueno', 'Excelente'][val - 1]}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Deja tu comentario aquí"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
              />
              <Button
                variant="contained"
                type="submit"
                disabled={loadingCreateReview}
                sx={{ fontWeight: 'bold', borderRadius: 2 }}
              >
                Enviar
              </Button>
            </Box>
          ) : (
            <MessageBox>
              Por favor{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>Registrarse</Link>{' '}
              para escribir una reseña
            </MessageBox>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductScreen;
