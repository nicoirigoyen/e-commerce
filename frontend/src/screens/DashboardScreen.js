// Recomendado: 1200x500px para imágenes horizontales en el carrusel
import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

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
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loadingFeatured, featuredItems, errorFeatured, loadingCreate, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loadingFeatured: false,
      featuredItems: [],
      errorFeatured: '',
      loadingCreate: false,
      loadingDelete: false,
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    fetchFeaturedItems();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_FEATURED_REQUEST' });
    try {
      await axios.post(
        '/api/featured',
        { title, description, imageUrl, link, active },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_FEATURED_SUCCESS' });
      toast.success('Ítem destacado creado');
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLink('');
      setActive(true);
      fetchFeaturedItems();
    } catch (err) {
      dispatch({ type: 'CREATE_FEATURED_FAIL', payload: getError(err) });
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('¿Eliminar este ítem destacado?')) return;
    dispatch({ type: 'DELETE_FEATURED_REQUEST' });
    try {
      await axios.delete(`/api/featured/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_FEATURED_SUCCESS' });
      toast.success('Ítem eliminado');
      fetchFeaturedItems();
    } catch (err) {
      dispatch({ type: 'DELETE_FEATURED_FAIL', payload: getError(err) });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImageUrl(data.imageUrl);
      toast.success('Imagen subida con éxito');
    } catch (err) {
      toast.error(getError(err));
    }
    setUploading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Helmet>
        <title>Panel de Control</title>
      </Helmet>

      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#D12B19', textShadow: '0 0 10px #D12B19', mb: 3 }}
      >
        Panel de Control
      </Typography>

      <Paper elevation={4} sx={{ p: 4, mb: 4, bgcolor: '#10141f', borderRadius: 3, boxShadow: '0 0 15px #1e3a8a88' }}>
        <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
          Ítems Destacados
        </Typography>

        {loadingFeatured ? (
          <LoadingBox />
        ) : errorFeatured ? (
          <MessageBox variant="danger">{errorFeatured}</MessageBox>
        ) : (
          <Grid container spacing={3}>
            {featuredItems.map((item) => (
              <Grid item xs={12} md={6} key={item._id}>
                <Card sx={{ backgroundColor: '#1a1f2b', color: 'white', border: '1px solid #1e3a8a', borderRadius: 2, boxShadow: '0 0 15px #1e3a8a50' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#D12B19' }}>{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', marginTop: '1rem', borderRadius: 8 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ color: '#1e88e5' }}>{item.link}</a>
                    </Typography>
                    <Typography sx={{ mt: 1 }}>Activo: {item.active ? 'Sí' : 'No'}</Typography>
                    <Button variant="contained" color="error" onClick={() => deleteHandler(item._id)} disabled={loadingDelete} sx={{ mt: 2 }}>
                      {loadingDelete ? <CircularProgress size={24} /> : 'Eliminar'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box component="form" onSubmit={submitHandler} sx={{ mt: 5, p: 3, backgroundColor: '#121826', borderRadius: 3, border: '1px solid #1e3a8a', boxShadow: '0 0 10px #1e3a8a50' }}>
          <Typography variant="h6" sx={{ color: '#f0f0f0', mb: 2 }}>
            Agregar nuevo ítem destacado
          </Typography>

          <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required margin="normal" InputLabelProps={{ style: { color: '#aaa' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField fullWidth label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" InputLabelProps={{ style: { color: '#aaa' } }} InputProps={{ style: { color: '#fff' } }} />

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ color: '#D12B19', borderColor: '#D12B19' }}>
              Cargar Imagen
              <input type="file" hidden onChange={uploadFileHandler} />
            </Button>
            {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            {imageUrl && (
              <Box mt={2}>
                <img src={imageUrl} alt="Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: 8 }} />
              </Box>
            )}
          </Box>

          <TextField fullWidth label="Link (opcional)" value={link} onChange={(e) => setLink(e.target.value)} margin="normal" InputLabelProps={{ style: { color: '#aaa' } }} InputProps={{ style: { color: '#fff' } }} />

          <FormControlLabel control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />} label="Activo" sx={{ mt: 2, color: '#ccc' }} />

          <Button type="submit" variant="contained" sx={{ mt: 2, background: 'linear-gradient(135deg, #1e3a8a 0%, #D12B19 100%)', color: '#fff', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(135deg, #D12B19 0%, #1e3a8a 100%)' } }} disabled={loadingCreate}>
            {loadingCreate ? <CircularProgress size={24} /> : 'Crear'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
