// CardComponent.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Este componente lo usaremos solo para productos
import { useContext } from 'react';
import { Store } from '../Store'; // Para el carrito, si es necesario
import '../estilos/CardComponent.css';

function CardComponent({ item, isProduct, addToCartHandler }) {
  return (
    <Card className="featured-card">
      <Link to={item.link}>
        <img src={item.imageUrl} className="card-img-top" alt={item.title} />
      </Link>
      <Card.Body>
        <Link to={item.link}>
          <Card.Title>{item.title}</Card.Title>
        </Link>
        <Card.Text>{item.description}</Card.Text>

        {isProduct ? (
          <>
            <Rating rating={item.rating} numReviews={item.numReviews} />
            <Card.Text>${item.price}</Card.Text>
            {item.countInStock === 0 ? (
              <Button variant="danger" disabled>
                Agotado
              </Button>
            ) : (
              <Button onClick={() => addToCartHandler(item)}>Ver más</Button>
            )}
          </>
        ) : (
          // Si no es un producto, solo mostramos un botón de "Leer más" o "Ver más"
          <Button variant="primary">Ver más</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
