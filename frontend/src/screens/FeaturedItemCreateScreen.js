import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';

export default function FeaturedItemCreateScreen() {
  const navigate = useNavigate();

  // Campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);

  // Estado para upload de imagen
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  // Estado para creación
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState('');

  // Función para subir la imagen al backend
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setLoadingUpload(true);
    setErrorUpload('');
    try {
      const { data } = await axios.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(data.url); // Suponiendo que el backend devuelve { url: '...' }
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload('Error al subir la imagen');
      setLoadingUpload(false);
    }
  };

  // Función para crear el featured item
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setErrorCreate('');
    try {
      await axios.post('/api/featured', {
        title,
        description,
        link,
        imageUrl,
        active,
      });
      setLoadingCreate(false);
      navigate('/admin/featured'); // Cambiá la ruta a donde tengas la lista de items
    } catch (error) {
      setErrorCreate('Error al crear el item destacado');
      setLoadingCreate(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nuevo Ítem Destacado
      </Typography>

      <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <TextField
          label="Link (opcional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Box sx={{ my: 2 }}>
          <Button variant="contained" component="label">
            Subir Imagen
            <input type="file" hidden accept="image/*" onChange={uploadFileHandler} />
          </Button>
          {loadingUpload && <CircularProgress size={24} sx={{ ml: 2 }} />}
          {errorUpload && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errorUpload}
            </Typography>
          )}
          {imageUrl && (
            <Box sx={{ mt: 2 }}>
              <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%' }} />
            </Box>
          )}
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              color="primary"
            />
          }
          label="Activo"
        />

        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loadingCreate}>
            {loadingCreate ? 'Creando...' : 'Crear Ítem'}
          </Button>
          {errorCreate && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorCreate}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
