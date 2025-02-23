import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product'; // Componente de producto
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import FeaturedSection from '../components/FeaturedSection';  // Importamos la sección destacada
import CategoryDropdown from '../components/CategoryDropdown';


// Reducer para manejar el estado de los productos
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

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  //const [product, setProducts] = useState([]);
  //const [categories, setCategories] = useState([]); // Lista de categorías
  const navigate = useNavigate(); // Hook para redirección


  // Cargar los productos desde la API cuando el componente se monte
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');  // Cambia esta URL según tu API
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
    <div>
      <Helmet>
        <title>UpSeeBuy</title>
      </Helmet>
      
      {/* ✅ Nueva Barra de Categorías */}
      <nav className="nav-bar">
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
      <h1>Productos Destacados</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>  {/* Muestra cada producto con su componente */}
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
