import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../estilos/SidebarMenu.css';


export default function SidebarMenu({ categories, onClose }) {
  const [pestañaActiva, setPestañaActiva] = useState('menu');
  const [cerrando, setCerrando] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setCerrando(true);
    setTimeout(() => {
      onClose();
    }, 300); // Tiempo igual al de la animación de salida
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/?query=${query}`);
      handleClose();
    }
  };

  return (
    <div className="sidebar-menu-overlay" onClick={handleClose}>
      <div
        className={`sidebar-menu ${cerrando ? 'slide-out' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Buscador con funcionalidad */}
        <form className="sidebar-search" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Buscar producto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Pestañas */}
        <div className="sidebar-tabs">
          <button
            className={pestañaActiva === 'menu' ? 'active' : ''}
            onClick={() => setPestañaActiva('menu')}
          >
            MENÚ
          </button>
          <button
            className={pestañaActiva === 'categorias' ? 'active' : ''}
            onClick={() => setPestañaActiva('categorias')}
          >
            CATEGORÍAS
          </button>
        </div>

        {/* Contenido */}
        <div className="sidebar-content">
          {pestañaActiva === 'menu' ? (
            <ul className="menu-list">
              <li><Link to="/garantias">GARANTÍAS <span className="badge importante">IMPORTANTE!</span></Link></li>
              <li><Link to="/nuevo">NUEVO INGRESO! <span className="badge nuevo">NEW!</span></Link></li>
              <li><Link to="/oferta">OFERTA FLASH! <span className="badge oferta">24HS</span></Link></li>
              <li><Link to="/preorden">PREORDEN <span className="badge preorden">NEW</span></Link></li>
              <li><Link to="/contacto">CONTACTO</Link></li>
              <li><Link to="/">INICIO</Link></li>
            </ul>
          ) : (
            <ul className="menu-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/search?category=${cat}`}>
                    {cat} <i className="fas fa-chevron-right flecha"></i>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
