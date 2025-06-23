import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FeaturedSection = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data } = await axios.get('/api/featured');
        setFeaturedItems(data);
      } catch (error) {
        console.error('Error al cargar ítems destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <Box
      className="featured-section"
      sx={{
        width: '100%',
        maxWidth: 1000,
        margin: 'auto',
        my: 4,
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress color="inherit" />
        </Box>
      ) : featuredItems.length === 0 ? (
        <Typography variant="h6" align="center">
          No hay novedades por el momento.
        </Typography>
      ) : (
        <Slider {...settings}>
          {featuredItems.map((item) => (
            <Box key={item.id} px={2}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 300,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                }}
              >
                <a href={item.link || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </CardContent>
                </a>
              </Card>
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default FeaturedSection;
