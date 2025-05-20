import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
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
import CategoryDropdown from '../components/CategoryDropdown';


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
        //setProducts(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  // Obtener categorías desde la API
  /*useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

    // Manejar selección de categoría y redirección
    const selectCategoryHandler = (category) => {
      navigate(`/search?category=${category}`); // Redirige al usuario a la URL de búsqueda con la categoría
    };
*/
  return (
    <HomeContainer>
      <Helmet>
        <title>UpSeeBuy</title>
      </Helmet>
      
      {/* ✅ Nueva Barra de Categorías */}
      <nav className="nav-bar ocultar-en-mobile">
        <CategoryDropdown />
        <button className="nav-button">Garantías</button>
        <button className="nav-button">Nuevo Ingreso</button>
        <button className="nav-button">Oferta Flash!</button>
        <button className="nav-button">Preorden</button>
        <button className="nav-button">Contacto</button>
        <button className="nav-button">Inicio</button>
      </nav>
      
      {/* Sección destacada de productos, noticias o promociones */}
      <FeaturedSection /> {/* Este componente muestra las cartas en un carrusel */}



      {/* Productos */}
      <SectionTitle>Productos Destacados</SectionTitle>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <Product key={product.slug} product={product} />
          ))
        )}
      </div>

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
