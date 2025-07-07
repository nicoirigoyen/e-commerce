import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Usuario actualizado');
      navigate('/admin/users');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Helmet>
        <title>Editar usuario</title>
      </Helmet>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          bgcolor: '#1C2E48',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 0 12px rgba(0,255,255,0.15)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#58f0ff' }}
        >
          Editar Usuario
        </Typography>

        {loading ? (
          <Box textAlign="center">
            <CircularProgress color="success" />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box component="form" onSubmit={submitHandler} noValidate>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#58f0ff' },
                  '&:hover fieldset': { borderColor: '#58f0ff' },
                  '&.Mui-focused fieldset': { borderColor: '#58f0ff' },
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#58f0ff' },
                  '&:hover fieldset': { borderColor: '#58f0ff' },
                  '&.Mui-focused fieldset': { borderColor: '#58f0ff' },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  sx={{ color: '#25D366' }}
                />
              }
              label="Administrador"
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loadingUpdate}
              sx={{
                mt: 3,
                bgcolor: '#D12B19',
                '&:hover': { bgcolor: '#FF3B3B' },
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'uppercase',
                py: 1.2,
                boxShadow: '0 0 10px rgba(209,43,25,0.6)',
              }}
            >
              {loadingUpdate ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
