import React, { useState, useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState('');
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

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

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Producto sin stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    //navigate('/cart');
    toast.success('Producto agregado al carrito');
  };

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Enlace copiado');
  };

  const whatsappShareHandler = () => {
    const message = `Mirá este producto: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
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

          <Typography variant="h5" sx={{ color: '#f0c040', fontWeight: 'bold', mt: 1 }}>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography sx={{ mt: 2, color: '#ccc' }}>{product.description}</Typography>

          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
            <Tooltip title="Compartir por WhatsApp">
              <IconButton onClick={whatsappShareHandler} sx={{ color: '#25D366' }}>
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copiar enlace">
              <IconButton onClick={copyLinkHandler} sx={{ color: '#ccc' }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir">
              <IconButton sx={{ color: '#f0c040' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
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

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      {product.specs && product.specs.length > 0 && (
        <Card
          sx={{
            mt: 5,
            p: 3,
            bgcolor: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: 3,
            color: '#eee',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Especificaciones Técnicas
          </Typography>

          <Collapse in={showAllSpecs} collapsedSize={200}>
            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
              {product.specs.map((spec, idx) => (
                <li key={idx}>
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </Typography>
                </li>
              ))}
            </Box>
          </Collapse>

          {product.specs.length > 5 && (
            <Button
              onClick={() => setShowAllSpecs(!showAllSpecs)}
              sx={{
                mt: 2,
                color: '#f0c040',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { color: '#fff' },
              }}
            >
              {showAllSpecs ? 'Ver menos' : 'Ver más'}
            </Button>
          )}
        </Card>
      )}
    </Box>
  );
}

export default ProductScreen;
