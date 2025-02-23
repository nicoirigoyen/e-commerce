import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/CategoryDropdown.css';

function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el despliegue del menú
  const navigate = useNavigate();

  // Obtener categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error obteniendo categorías:', err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
    setIsOpen(false); // Cierra el menú después de hacer clic
  };

  return (
    <div 
      className="category-dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="category-button">
        <i className="fas fa-bars"></i> CATEGORÍAS
      </button>
      {isOpen && (
        <div className="category-list">
          {categories.map((category) => (
            <button key={category} onClick={() => handleCategoryClick(category)}>
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
