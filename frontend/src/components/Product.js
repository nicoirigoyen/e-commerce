import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import styled from 'styled-components';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <ProductCard>
      <Link to={`/product/${product.slug}`}>
        <ProductImage src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <ProductTitle>{product.name}</ProductTitle>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <ProductPrice>${product.price}</ProductPrice>
        {product.countInStock === 0 ? (
          <Button variant="danger" disabled>
            Agotado
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Agregar al carrito</Button>
        )}
      </Card.Body>
    </ProductCard>
  );
}

const ProductCard = styled(Card)`
  border: 1px solid #ddd;
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px); /* Efecto hover */
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: contain; /* Ajustar imagen al contenedor */
  border-bottom: 1px solid #ddd;
`;

const ProductTitle = styled(Card.Title)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const ProductPrice = styled(Card.Text)`
  font-size: 1.2rem;
  color: #28a745;
  font-weight: 700;
`;

export default Product;
