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
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          p: 2,
          bgcolor: '#121212', // Color de fondo oscuro moderno
          color: 'white',
          fontFamily: "'Inter', sans-serif",
          boxShadow: 6,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        },
      }}
      aria-label="Menú lateral"
    >
      {/* HEADER con nombre y botón cerrar */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 2,
          fontWeight: '700',
          fontSize: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 1,
          mb: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          userSelect: 'none',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: '700' }}>
          MENÚ
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ color: 'primary.contrastText', p: 0.5, ml: 1 }}
          aria-label="Cerrar menú"
          size="large"
        >
          <ChevronRightIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Buscador */}
      <Box
        component="form"
        onSubmit={submitHandler}
        mb={3}
        sx={{ position: 'relative' }}
        aria-label="Formulario de búsqueda de productos"
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar producto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiInputBase-root': {
              fontSize: '0.95rem',
              px: 1.5,
              color: 'text.primary',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: 0 }}>
                <IconButton type="submit" edge="end" aria-label="buscar" size="large">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            'aria-label': 'Buscar producto',
          }}
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="Selección de menú o categorías"
        sx={{
          mb: 2,
          '& .MuiTabs-indicator': {
            bgcolor: 'secondary.main',
            height: 3,
            borderRadius: 2,
          },
          '& .MuiTab-root': {
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            color: 'text.secondary',
          },
          '& .Mui-selected': {
            color: 'secondary.main',
          },
        }}
      >
        <Tab label="MENÚ" id="tab-menu" aria-controls="tabpanel-menu" />
        <Tab label="CATEGORÍAS" id="tab-categories" aria-controls="tabpanel-categories" />
      </Tabs>

      {/* Contenido con fade */}
      <Fade
        in={fadeIn}
        timeout={300}
        style={{ transitionDelay: fadeIn ? '0ms' : '200ms' }}
        unmountOnExit
      >
        <Box
          sx={{ flexGrow: 1, overflowY: 'auto' }}
          role="tabpanel"
          id={tabIndex === 0 ? 'tabpanel-menu' : 'tabpanel-categories'}
          aria-labelledby={tabIndex === 0 ? 'tab-menu' : 'tab-categories'}
        >
          {tabIndex === 0 ? (
            <List disablePadding>
              <ListItem
                button
                component={Link}
                to="/garantias"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Garantías importante"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ flexShrink: 0 }}
                  >
                    GARANTÍAS
                  </Typography>
                  <Badge sx={badgeStyles.importante}>IMPORTANTE!</Badge>
                </Box>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/nuevo"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Nuevo ingreso"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ flexShrink: 0 }}
                  >
                    NUEVO INGRESO!
                  </Typography>
                  <Badge sx={badgeStyles.nuevo}>NEW!</Badge>
                </Box>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/oferta"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Oferta flash 24 horas"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ flexShrink: 0 }}
                  >
                    OFERTA FLASH!
                  </Typography>
                  <Badge sx={badgeStyles.oferta}>24HS</Badge>
                </Box>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/preorden"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Preorden nuevo"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ flexShrink: 0 }}
                  >
                    PREORDEN
                  </Typography>
                  <Badge sx={badgeStyles.preorden}>NEW</Badge>
                </Box>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/contacto"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Contacto"
              >
                <Typography variant="body1" color="text.primary">
                  CONTACTO
                </Typography>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/"
                onClick={onClose}
                sx={{ px: 0, py: 1.5 }}
                aria-label="Inicio"
              >
                <Typography variant="body1" color="text.primary">
                  INICIO
                </Typography>
              </ListItem>
            </List>
          ) : (
            <List disablePadding>
              {categories.map((cat) => (
                <ListItem
                  button
                  key={cat}
                  component={Link}
                  to={`/search?category=${encodeURIComponent(cat)}`}
                  onClick={onClose}
                  sx={{ px: 0, py: 1.5 }}
                  aria-label={`Categoría ${cat}`}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      fontWeight: 600,
                      color: 'text.primary',
                      textTransform: 'capitalize',
                    }}
                  >
                    {cat}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Fade>
    </Drawer>
  );
}
