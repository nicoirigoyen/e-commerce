import React, { useState, useEffect } from 'react';
import CardComponent from './CardComponent';  // Importamos el componente de las cartas
import { useContext } from 'react';
import { Store } from '../Store';  // Para agregar al carrito
import axios from 'axios';
import Slider from 'react-slick';  // Importamos el componente Slider de React Slick

// Estilos de Slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FeaturedSection = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const [featuredItems, setFeaturedItems] = useState([]);

  // Cargar los datos de las cartas destacadas
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const data = [
        {
          id: 1,
          title: 'Oferta de Navidad',
          description: 'Consigue un 50% de descuento.',
          imageUrl: 'https://via.placeholder.com/150',
          link: '#',
          isProduct: false,  // Indica que no es un producto
        },
        {
          id: 2,
          title: 'Noticia Importante',
          description: 'Lee sobre nuestra última actualización.',
          imageUrl: 'https://via.placeholder.com/150',
          link: '#',
          isProduct: false,  // Indica que no es un producto
        },
        {
          id: 3,
          title: 'Super Oferta de Año Nuevo',
          description: 'Descuentos de hasta el 70%.',
          imageUrl: 'https://via.placeholder.com/150',
          link: '#',
          isProduct: false,  // Indica que no es un producto
        },
        {
          id: 4,
          title: 'Producto Destacado',
          description: 'Un gran producto que no puedes perderte.',
          imageUrl: 'https://via.placeholder.com/150',
          price: 30.0,
          rating: 4.5,
          numReviews: 50,
          countInStock: 5,
          link: '/product/slug',
          isProduct: true,  // Este es un producto
        },
      ];

      setFeaturedItems(data);
    };

    fetchFeaturedItems();
  }, []);

  const addToCartHandler = async (product) => {
    // Lógica para agregar un producto al carrito
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  // Configuración de React Slick
  const settings = {
    dots: true,  // Mostrar puntos de navegación
    infinite: true,  // Permitir un deslizamiento infinito
    speed: 500,  // Velocidad de la animación
    slidesToShow: 3,  // Número de elementos que se muestran
    slidesToScroll: 1,  // Número de elementos que se desplazan por vez
    nextArrow: <div className="slick-arrow slick-next">→</div>,  // Personalización de la flecha siguiente
    prevArrow: <div className="slick-arrow slick-prev">←</div>,  // Personalización de la flecha anterior
  };

  return (
    <div className="featured-section">
      <Slider {...settings}>  {/* Usamos Slider de React Slick */}
        {featuredItems.map(item => (
          <div key={item.id}>
            <CardComponent
              item={item}
              isProduct={item.isProduct}
              addToCartHandler={addToCartHandler}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedSection;
