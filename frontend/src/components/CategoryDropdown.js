import React, { useEffect, useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Responsividad con MUI hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error obteniendo categorías:', err.message);
      }
    }
    fetchCategories();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<MenuIcon />}
        onClick={handleClick}
        aria-controls={open ? 'category-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          textTransform: 'none',
          fontWeight: '700',
          bgcolor: '#2e3b55',
          color: '#fff',
          px: 2,
          py: 1,
          borderRadius: 2,
          minWidth: isMobile ? 100 : 140,
          '&:hover': {
            bgcolor: '#435a8a',
          },
          transition: 'background-color 0.3s ease',
          fontSize: isMobile ? '0.9rem' : '1rem',
        }}
      >
        CATEGORÍAS
      </Button>

      <Menu
        id="category-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#fafafa',
            minWidth: isMobile ? '70vw' : 220,
            maxHeight: '60vh',
            overflowY: 'auto',
            boxShadow:
              '0px 3px 10px rgba(0,0,0,0.15), 0px 6px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'category-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {categories.length === 0 ? (
          <MenuItem disabled sx={{ fontStyle: 'italic' }}>
            No hay categorías
          </MenuItem>
        ) : (
          categories.map((category) => (
            <MenuItem
              key={category}
              onClick={() => handleCategoryClick(category)}
              sx={{
                px: 2,
                py: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: '#e3e9f3',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CategoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={category}
                primaryTypographyProps={{
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              />
            </MenuItem>
          ))
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            navigate('/search');
            handleClose();
          }}
          sx={{
            fontWeight: 700,
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#e3e9f3',
            },
            fontSize: isMobile ? '0.95rem' : '1.05rem',
          }}
        >
          <ListItemText primary="Ver todos" />
        </MenuItem>
      </Menu>
    </>
  );
}
