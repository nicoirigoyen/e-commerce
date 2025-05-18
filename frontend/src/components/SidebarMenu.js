import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../estilos/SidebarMenu.css';
import lupa from '../assets/img/lupa.png';



export default function SidebarMenu({ categories, onClose }) {
  const [pestañaActiva, setPestañaActiva] = useState('menu');
  const [cerrando, setCerrando] = useState(false);
  const [query, setQuery] = useState('');
  const [animarTransicion, setAnimarTransicion] = useState(false);

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

  const cambiarPestaña = (nueva) => {
    setAnimarTransicion(true);
    setTimeout(() => {
      setPestañaActiva(nueva);
      setAnimarTransicion(false);
    }, 150); // Para que la animación de desvanecimiento se vea
  };

  return (
    <div className="sidebar-menu-overlay" onClick={handleClose}>
      <div
        className={`sidebar-menu ${cerrando ? 'slide-out' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Buscador */}
        <form className="sidebar-search" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Buscar producto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
          <img src={lupa} alt="Buscar" className="icono-lupa" />
          </button>
        </form>

        {/* Pestañas */}
        <div className="sidebar-tabs">
          <button
            className={pestañaActiva === 'menu' ? 'active' : 'inactive'}
            onClick={() => cambiarPestaña('menu')}
          >
            MENU
          </button>
          <button
            className={pestañaActiva === 'categorias' ? 'active' : 'inactive'}
            onClick={() => cambiarPestaña('categorias')}
          >
            CATEGORÍAS
          </button>
        </div>

        {/* Contenido */}
        <div className={`sidebar-content ${animarTransicion ? 'fade' : ''}`}>
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
