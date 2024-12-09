import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup className="input-group-elegante rounded-pill shadow">
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          aria-label="Buscar Productos"
          aria-describedby="button-search"
          className="border-0"
          style={{
            backgroundColor: '#ECF0F1', // Fondo gris claro
            color: '#2C3E50', // Texto en azul oscuro
          }}
        />
        <Button 
          variant="light" 
          type="submit" 
          id="button-search" 
          className="rounded-pill"
          style={{
            backgroundColor: '#1ABC9C', // Turquesa
            color: '#FFFFFF', // Texto en blanco
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F39C12'} // Cambia a naranja al pasar el mouse
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1ABC9C'} // Vuelve a turquesa al salir
        >
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
  
  
  
}
