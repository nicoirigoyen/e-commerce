import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { Helmet } from 'react-helmet-async';
import Product from '../components/Product'; // Componente de producto
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import FeaturedSection from '../components/FeaturedSection';
import { HomeContainer, SectionTitle, ProductContainer, WhatsAppButton } from '../estilos/HomeSreenStyles'; // Actualizamos el nombre

// Importamos el ícono de WhatsApp
import { FaWhatsapp } from 'react-icons/fa'; // Importa el ícono de WhatsApp desde react-icons

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <HomeContainer>
      <Helmet>
        <title>UpSeeBuy</title>
      </Helmet>
      
      {/* Sección destacada */}
      <FeaturedSection />

      <SectionTitle>Productos Destacados</SectionTitle>

      <ProductContainer>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <Product key={product.slug} product={product} />
          ))
        )}
      </ProductContainer>

      {/* Botón de WhatsApp */}
      <WhatsAppButton 
        href="https://wa.me/1234567890"  // Cambia este número por el tuyo
        target="_blank" // Abre el enlace en una nueva pestaña
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} color="white" /> {/* Ícono de WhatsApp */}
      </WhatsAppButton>
    </HomeContainer>
  );
};

export default HomeScreen;
