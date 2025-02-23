import styled from 'styled-components';

export const ProductContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px;
  gap: 15px;
  margin-bottom: 40px; /* Espacio debajo de los productos destacados */
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

  /* Para pantallas grandes */
  @media (max-width: 1200px) {
    gap: 20px;
  }

  /* Para pantallas medianas (tabletas) */
  @media (max-width: 768px) {
    gap: 10px;
  }

  /* Para pantallas pequeñas (móviles) */
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const ProductCard = styled.div`
  width: 200px;
  flex-shrink: 0; /* Evitar que los productos se reduzcan más allá del tamaño mínimo */
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  /* Para pantallas pequeñas */
  @media (max-width: 480px) {
    width: 150px;
  }
`;

