import styled from 'styled-components';
import { Button } from 'react-bootstrap';

// Estilo del contenedor de productos destacados
export const ProductContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px;
  gap: 15px;
  margin-bottom: 40px; 
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
`;

// Estilo del botón de WhatsApp
export const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  border-radius: 50%;
  background-color: #25d366;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  &:hover {
    background-color: #128c7e;
  }
`;

export const HomeContainer = styled.div`
  padding: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
