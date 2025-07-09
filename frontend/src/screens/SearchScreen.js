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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';

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
  { name: '$1 a $50', value: '1-50' },
  { name: '$51 a $200', value: '51-200' },
  { name: '$201 a $1000', value: '201-1000' },
];

const ratings = [
  { name: '4 estrellas o más', rating: 4 },
  { name: '3 estrellas o más', rating: 3 },
  { name: '2 estrellas o más', rating: 2 },
  { name: '1 estrella o más', rating: 1 },
];

export default function SearchScreen() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const rawCategory = sp.get('category') || 'all';
  const category = decodeURIComponent(rawCategory);
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
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
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
    <Box sx={{ px: { xs: 1, md: 4 }, py: 3 }}>
      <Helmet>
        <title>Buscar producto...</title>
      </Helmet>

      <Grid container spacing={3}>
        {/* Filtros */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                borderRadius: 3,
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <Typography variant="h6">Filtros</Typography>
              <Box component="ul" sx={{ listStyle: 'none', pl: 0, mt: 1 }}>
                <li>
                  <MuiLink component={Link} to={getFilterUrl({ category: 'all' })} underline="hover" sx={{ color: 'white' }}>
                    Todas las categorías
                  </MuiLink>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <MuiLink component={Link} to={getFilterUrl({ category: c })} underline="hover" sx={{ color: 'white' }}>
                      {c}
                    </MuiLink>
                  </li>
                ))}
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Precio</Typography>
              {prices.map((p) => (
                <MuiLink
                  key={p.value}
                  component={Link}
                  to={getFilterUrl({ price: p.value })}
                  underline="hover"
                  sx={{ display: 'block', color: 'white' }}
                >
                  {p.name}
                </MuiLink>
              ))}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Puntuación</Typography>
              {ratings.map((r) => (
                <MuiLink
                  key={r.rating}
                  component={Link}
                  to={getFilterUrl({ rating: r.rating })}
                  underline="hover"
                  sx={{ display: 'block', color: 'white' }}
                >
                  <Rating rating={r.rating} caption=" o más" />
                </MuiLink>
              ))}
            </Paper>
          </Grid>
        )}

        {/* Resultados */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2, gap: 2 }}
              >
                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: 'white' }}>
                    {countProducts} resultados {query !== 'all' && `para "${query}"`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small" sx={{ bgcolor: 'white', borderRadius: 1 }}>
                    <InputLabel id="order-label">Ordenar</InputLabel>
                    <Select
                      labelId="order-label"
                      value={order}
                      label="Ordenar"
                      onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
                    >
                      <MenuItem value="newest">Más nuevo</MenuItem>
                      <MenuItem value="lowest">Precio: menor a mayor</MenuItem>
                      <MenuItem value="highest">Precio: mayor a menor</MenuItem>
                      <MenuItem value="toprated">Mejor puntuados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Productos */}
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {[...Array(pages).keys()].map((x) => (
                  <Button
                    key={x + 1}
                    variant={x + 1 === page ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => navigate(getFilterUrl({ page: x + 1 }))}
                    size="small"
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
