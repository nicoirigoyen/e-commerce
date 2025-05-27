import React, { useEffect, useReducer, useState } from 'react';
import {
  Grid,
  Typography,
  Link as MuiLink,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Rating from '../components/Rating';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];

export const ratings = [
  { name: '4 stars & up', rating: 4 },
  { name: '3 stars & up', rating: 3 },
  { name: '2 stars & up', rating: 2 },
  { name: '1 star & up', rating: 1 },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = Number(sp.get('page') || 1);

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      products: [],
      pages: 1,
      countProducts: 0,
    });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>Buscar producto...</title>
      </Helmet>

      <Grid container spacing={3}>
        {/* Filtros laterales */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Categorías
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, listStyle: 'none' }}>
              <li>
                <MuiLink
                  component={Link}
                  to={getFilterUrl({ category: 'all' })}
                  underline="hover"
                  color={category === 'all' ? 'primary' : 'textPrimary'}
                  sx={{ fontWeight: category === 'all' ? 'bold' : 'normal' }}
                >
                  Todos
                </MuiLink>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <MuiLink
                    component={Link}
                    to={getFilterUrl({ category: c })}
                    underline="hover"
                    color={c === category ? 'primary' : 'textPrimary'}
                    sx={{ fontWeight: c === category ? 'bold' : 'normal' }}
                  >
                    {c}
                  </MuiLink>
                </li>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Precio
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, listStyle: 'none' }}>
              <li>
                <MuiLink
                  component={Link}
                  to={getFilterUrl({ price: 'all' })}
                  underline="hover"
                  color={price === 'all' ? 'primary' : 'textPrimary'}
                  sx={{ fontWeight: price === 'all' ? 'bold' : 'normal' }}
                >
                  Todos
                </MuiLink>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <MuiLink
                    component={Link}
                    to={getFilterUrl({ price: p.value })}
                    underline="hover"
                    color={p.value === price ? 'primary' : 'textPrimary'}
                    sx={{ fontWeight: p.value === price ? 'bold' : 'normal' }}
                  >
                    {p.name}
                  </MuiLink>
                </li>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mejor puntuados
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, listStyle: 'none' }}>
              {ratings.map((r) => (
                <li key={r.name}>
                  <MuiLink
                    component={Link}
                    to={getFilterUrl({ rating: r.rating })}
                    underline="hover"
                    color={String(r.rating) === String(rating) ? 'primary' : 'textPrimary'}
                    sx={{ fontWeight: String(r.rating) === String(rating) ? 'bold' : 'normal' }}
                  >
                    <Rating caption=" & mas" rating={r.rating} />
                  </MuiLink>
                </li>
              ))}
              <li>
                <MuiLink
                  component={Link}
                  to={getFilterUrl({ rating: 'all' })}
                  underline="hover"
                  color={rating === 'all' ? 'primary' : 'textPrimary'}
                  sx={{ fontWeight: rating === 'all' ? 'bold' : 'normal' }}
                >
                  <Rating caption=" & mas" rating={0} />
                </MuiLink>
              </li>
            </Box>
          </Paper>
        </Grid>

        {/* Resultados y controles */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Paper
              sx={{
                p: 2,
                bgcolor: 'error.main',
                color: 'error.contrastText',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          ) : (
            <>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" component="div" noWrap>
                    {countProducts === 0 ? 'No' : countProducts} resultados
                    {query !== 'all' && ` : "${query}"`}
                    {category !== 'all' && ` / Categoria: ${category}`}
                    {price !== 'all' && ` / Precio: ${price}`}
                    {rating !== 'all' && ` / Rating: ${rating} estrellas & más`}
                    {query !== 'all' ||
                    category !== 'all' ||
                    price !== 'all' ||
                    rating !== 'all' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/search')}
                        sx={{ ml: 1 }}
                      >
                        Borrar filtros
                      </Button>
                    ) : null}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 0 } }}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel id="order-label">Ordenar por</InputLabel>
                    <Select
                      labelId="order-label"
                      value={order}
                      label="Ordenar por"
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <MenuItem value="newest">Más nuevo</MenuItem>
                      <MenuItem value="lowest">Precio: de menor a mayor</MenuItem>
                      <MenuItem value="highest">Precio: de mayor a menor</MenuItem>
                      <MenuItem value="toprated">Mejor puntuados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Lista de productos */}
              {products.length === 0 && (
                <Typography variant="h6" color="textSecondary">
                  No se encontraron productos.
                </Typography>
              )}

              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <Product product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {[...Array(pages).keys()].map((x) => (
                  <Button
                    key={x + 1}
                    variant={x + 1 === page ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => {
                      navigate(getFilterUrl({ page: x + 1 }));
                    }}
                    size="small"
                    sx={{ minWidth: 36 }}
                  >
                    {x + 1}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
