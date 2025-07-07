import React, { useContext, useEffect, useReducer } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Usuario eliminado correctamente');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Helmet>
        <title>Usuarios</title>
      </Helmet>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          bgcolor: '#1C2E48',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 0 12px rgba(0,255,255,0.15)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 'bold', color: '#58f0ff', textAlign: 'center' }}
        >
          Lista de Usuarios
        </Typography>

        {loadingDelete && (
          <Box textAlign="center" mb={2}>
            <CircularProgress color="error" />
          </Box>
        )}

        {loading ? (
          <Box textAlign="center">
            <CircularProgress color="info" />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: '#121e33' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID', 'Nombre', 'Email', 'Admin', 'Acciones'].map((header) => (
                    <TableCell key={header} sx={{ color: '#58f0ff', fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ color: '#ccc' }}>{user._id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: '#58f0ff' }}>{user.email}</TableCell>
                    <TableCell sx={{ color: user.isAdmin ? '#25D366' : '#f44336' }}>
                      {user.isAdmin ? 'Sí' : 'No'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteHandler(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
