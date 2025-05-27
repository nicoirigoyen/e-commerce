import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import '../estilos/CardComponent.css';

function CardComponent({ item, isProduct, addToCartHandler }) {
  return (
    <Card className="featured-card">
      <Link to={item.link}>
        <img src={item.imageUrl} className="card-img-top" alt={item.title} />
      </Link>
      <Card.Body>
        <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title>{item.title}</Card.Title>
        </Link>
        <Card.Text>{item.description}</Card.Text>

        {isProduct ? (
          <>
            <Rating rating={item.rating} numReviews={item.numReviews} />
            <Card.Text>${item.price}</Card.Text>
            {item.countInStock === 0 ? (
              <Button 
                variant="contained" 
                color="error" 
                disabled
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Agotado
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => addToCartHandler(item)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Ver más
              </Button>
            )}
          </>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Ver más
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
