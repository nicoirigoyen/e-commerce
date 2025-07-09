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
  Typography,
} from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error cargando categorías:', err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category, subcategory) => {
    const query = subcategory ? `${category}/${subcategory}` : category;
    navigate(`/search?category=${encodeURIComponent(query)}`);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<AppsIcon />}
        onClick={handleClick}
        aria-controls={open ? 'category-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          textTransform: 'none',
          fontWeight: 'bold',
          bgcolor: '#141414',
          color: '#5ee6ff',
          border: '1px solid #5ee6ff',
          borderRadius: 3,
          px: 2.5,
          py: 1.2,
          boxShadow: '0 0 10px #5ee6ff33',
          fontSize: isMobile ? '0.85rem' : '1rem',
          transition: '0.3s ease',
          '&:hover': {
            bgcolor: '#1b1b1b',
            color: '#ffffff',
            boxShadow: '0 0 20px #5ee6ff77',
          },
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
            bgcolor: '#111',
            color: '#e0e0e0',
            border: '1px solid #5ee6ff',
            borderRadius: 3,
            boxShadow: '0 6px 30px #5ee6ff33',
            minWidth: isMobile ? '75vw' : 260,
            maxHeight: '65vh',
            overflowY: 'auto',
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
          <MenuItem disabled>
            <em>No hay categorías disponibles</em>
          </MenuItem>
        ) : (
          categories.map((cat) => (
            <div key={cat.nombre}>
              <MenuItem disabled sx={{ opacity: 0.85 }}>
                <ListItemIcon>
                  <CategoryIcon sx={{ color: '#5ee6ff' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} color="#5ee6ff">
                      {cat.nombre}
                    </Typography>
                  }
                />
              </MenuItem>

              {cat.subcategorias && cat.subcategorias.length > 0 ? (
                cat.subcategorias.map((subcat) => (
                  <MenuItem
                    key={subcat}
                    onClick={() => handleCategoryClick(cat.nombre, subcat)}
                    sx={{
                      pl: 6,
                      py: 1,
                      fontSize: '0.95rem',
                      '&:hover': {
                        bgcolor: '#1a1a1a',
                        color: '#5ee6ff',
                      },
                    }}
                  >
                    {subcat}
                  </MenuItem>
                ))
              ) : (
                <MenuItem
                  onClick={() => handleCategoryClick(cat.nombre)}
                  sx={{
                    pl: 4,
                    py: 1,
                    fontStyle: 'italic',
                    '&:hover': {
                      bgcolor: '#1a1a1a',
                      color: '#5ee6ff',
                    },
                  }}
                >
                  Ver todos
                </MenuItem>
              )}

              <Divider sx={{ my: 1, borderColor: '#2b2b2b' }} />
            </div>
          ))
        )}

        <MenuItem
          onClick={() => {
            navigate('/search');
            handleClose();
          }}
          sx={{
            fontWeight: 700,
            px: 2,
            py: 1,
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            '&:hover': {
              bgcolor: '#1a1a1a',
              color: '#5ee6ff',
            },
          }}
        >
          Ver todos los productos
        </MenuItem>
      </Menu>
    </>
  );
}
