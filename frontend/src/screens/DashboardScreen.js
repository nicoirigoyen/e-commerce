import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_FEATURED_REQUEST':
      return { ...state, loadingFeatured: true };
    case 'FETCH_FEATURED_SUCCESS':
      return { ...state, loadingFeatured: false, featuredItems: action.payload };
    case 'FETCH_FEATURED_FAIL':
      return { ...state, loadingFeatured: false, errorFeatured: action.payload };
    case 'CREATE_FEATURED_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_FEATURED_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FEATURED_FAIL':
      return { ...state, loadingCreate: false, errorFeatured: action.payload };
    case 'DELETE_FEATURED_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_FEATURED_SUCCESS':
      return { ...state, loadingDelete: false };
    case 'DELETE_FEATURED_FAIL':
      return { ...state, loadingDelete: false, errorFeatured: action.payload };
    // Puedes agregar casos para summary o error general si usas
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error, loadingFeatured, featuredItems, errorFeatured, loadingCreate, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingFeatured: false,
    featuredItems: [],
    errorFeatured: '',
    loadingCreate: false,
    loadingDelete: false,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  // Para formulario nuevo featured
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    const fetchFeaturedItems = async () => {
      dispatch({ type: 'FETCH_FEATURED_REQUEST' });
      try {
        const { data } = await axios.get('/api/featured', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_FEATURED_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FEATURED_FAIL', payload: getError(err) });
      }
    };

    fetchSummary();
    fetchFeaturedItems();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_FEATURED_REQUEST' });
    try {
      const { data } = await axios.post(
        '/api/featured',
        { title, description, imageUrl, link, active },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_FEATURED_SUCCESS' });
      alert('Ítem destacado creado');
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLink('');
      setActive(true);
      // Recargar lista
      dispatch({ type: 'FETCH_FEATURED_REQUEST' });
      const { data: updatedItems } = await axios.get('/api/featured', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_FEATURED_SUCCESS', payload: updatedItems });
    } catch (err) {
      dispatch({ type: 'CREATE_FEATURED_FAIL', payload: getError(err) });
      alert(getError(err));
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('¿Estás seguro que querés eliminar este ítem?')) {
      return;
    }
    dispatch({ type: 'DELETE_FEATURED_REQUEST' });
    try {
      await axios.delete(`/api/featured/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_FEATURED_SUCCESS' });
      alert('Ítem eliminado');
      // Recargar lista
      dispatch({ type: 'FETCH_FEATURED_REQUEST' });
      const { data: updatedItems } = await axios.get('/api/featured', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_FEATURED_SUCCESS', payload: updatedItems });
    } catch (err) {
      dispatch({ type: 'DELETE_FEATURED_FAIL', payload: getError(err) });
      alert(getError(err));
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Control
      </Typography>

      {/* Aquí puedes dejar tu summary como está */}

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ítems Destacados
        </Typography>

         {/* Aquí agregamos el botón para crear un nuevo ítem 
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => navigate('/admin/featured/create')}
        >
          Crear Nuevo Ítem Destacado
      </Button>*/}

        {loadingFeatured ? (
          <LoadingBox />
        ) : errorFeatured ? (
          <MessageBox variant="danger">{errorFeatured}</MessageBox>
        ) : (
          <Box>
            {featuredItems.length === 0 && <MessageBox>No hay ítems destacados.</MessageBox>}

            <Grid container spacing={2}>
              {featuredItems.map((item) => (
                <Grid item xs={12} md={6} key={item._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography>{item.description}</Typography>
                      <img src={item.imageUrl} alt={item.title} width="100%" />
                      <Typography>
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.link}
                        </a>
                      </Typography>
                      <Typography>Activo: {item.active ? 'Sí' : 'No'}</Typography>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteHandler(item._id)}
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? <CircularProgress size={24} /> : 'Eliminar'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box component="form" onSubmit={submitHandler} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Agregar Ítem Destacado
              </Typography>
              <TextField
                fullWidth
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="URL Imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                margin="normal"
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loadingCreate}>
                {loadingCreate ? <CircularProgress size={24} /> : 'Crear'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
