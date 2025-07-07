import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { getError } from '../utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, featured: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#121212',
  color: '#fff',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 0 15px #00fff760',
}));

const Image = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: 500,
  objectFit: 'cover',
  display: 'block',
});

export default function FeaturedSection() {
  const [{ loading, error, featured }, dispatch] = useReducer(reducer, {
    loading: false,
    featured: [],
    error: '',
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/featured');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchFeatured();
  }, []);

  return loading ? (
    <CircularProgress sx={{ color: '#00fff7' }} />
  ) : error ? (
    <Typography sx={{ color: 'red' }}>{error}</Typography>
  ) : featured.length === 0 ? (
    <Typography sx={{ color: '#ccc' }}>No hay ítems destacados.</Typography>
  ) : (
    <Box>
      <AutoPlaySwipeableViews interval={5000} enableMouseEvents>
        {featured.map((item, index) => (
          <StyledPaper key={index}>
            <Image src={item.imageUrl} alt={item.title} />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                bgcolor: 'rgba(0,0,0,0.6)',
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: '#00fff7' }}>
                {item.title}
              </Typography>
              {item.description && (
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {item.description}
                </Typography>
              )}
            </Box>
          </StyledPaper>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
}
