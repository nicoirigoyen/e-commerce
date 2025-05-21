import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../estilos/FeaturedSection.css';

const FeaturedSection = () => {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data } = await axios.get('/api/featured');  // Endpoint general de ofertas o noticias
        setFeaturedItems(data);
      } catch (error) {
        console.error('Error al cargar ítems destacados:', error);
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
  };

  return (
    <div className="featured-section">
      {featuredItems.length === 0 ? (
        <p>Cargando novedades...</p>
      ) : (
        <Slider {...settings}>
          {featuredItems.map((item) => (
            <div key={item.id} className="featured-slide">
              <a href={item.link || '#'} className="featured-link">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="featured-image"
                />
                <div className="featured-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default FeaturedSection;
