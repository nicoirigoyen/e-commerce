import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  Typography,
  Fade,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, useNavigate } from 'react-router-dom';

export default function SidebarMenu({ categories, open, onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [fadeIn, setFadeIn] = useState(true);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Manejo de cambio de tab con fade sincronizado
  const handleTabChange = (event, newValue) => {
    setFadeIn(false);
    setTimeout(() => {
      setTabIndex(newValue);
      setFadeIn(true);
    }, 200);
  };

  // Debounce para búsqueda: navega solo después de 500ms sin escribir
  useEffect(() => {
    if (!query.trim()) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      navigate(`/search/?query=${encodeURIComponent(query.trim())}`);
      onClose();
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [query, navigate, onClose]);

  // Handler para submit por si presionan Enter
  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      clearTimeout(debounceTimer.current);
      navigate(`/search/?query=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const badgeStyles = {
    importante: {
      bgcolor: 'error.main',
      color: 'white',
      ml: 1,
      px: 1,
      borderRadius: 1,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      height: 22,
      minWidth: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nuevo: {
      bgcolor: 'secondary.main',
      color: 'white',
      ml: 1,
      px: 1,
      borderRadius: 1,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      height: 22,
      minWidth: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    oferta: {
      bgcolor: 'warning.main',
      color: 'black',
      ml: 1,
      px: 1,
      borderRadius: 1,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      height: 22,
      minWidth: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    preorden: {
      bgcolor: 'info.main',
      color: 'white',
      ml: 1,
      px: 1,
      borderRadius: 1,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      height: 22,
      minWidth: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
      <Drawer
        anchor="left"
        open={sidebarIsOpen}
        onClose={() => setSidebarIsOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 300,
            bgcolor: '#1C2E48',
            color: 'white',
          },
        }}
      >
        <Box role="presentation" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Menú
          </Typography>

          {/* Navegación común */}
          <List>
            <ListItem button component={Link} to="/" onClick={() => setSidebarIsOpen(false)}>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button component={Link} to="/cart" onClick={() => setSidebarIsOpen(false)}>
              <ListItemText primary="Carrito" />
            </ListItem>

            {userInfo ? (
              <>
                <ListItem button component={Link} to="/profile" onClick={() => setSidebarIsOpen(false)}>
                  <ListItemText primary="Mi Perfil" />
                </ListItem>
                <ListItem button component={Link} to="/orderhistory" onClick={() => setSidebarIsOpen(false)}>
                  <ListItemText primary="Pedidos" />
                </ListItem>
                <ListItem button onClick={signoutHandler}>
                  <ListItemText primary="Salir" />
                </ListItem>
              </>
            ) : (
              <ListItem button component={Link} to="/signin" onClick={() => setSidebarIsOpen(false)}>
                <ListItemText primary="Ingresar" />
              </ListItem>
            )}

            {/* Categorías */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Categorías
            </Typography>
            {categories.map((category) => (
              <ListItem
                button
                key={category}
                component={Link}
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>


  );
}
