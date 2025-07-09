import React, { useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SidebarCategoryAccordion() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error cargando categorías:', err.message);
      }
    };
    fetchCats();
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: '#10121A' }}>
      {/* Buscador integrado sin recuadro */}
      <Box sx={{ mb: 2 }}>
        <SearchBox />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          color: '#00bfff',
          borderBottom: '2px solid #222',
          pb: 0.5,
        }}
      >
        Categorías
      </Typography>

      {categories.map((cat) => (
        <Accordion
          key={cat.nombre}
          sx={{
            bgcolor: '#161a22',
            color: '#fff',
            borderRadius: 2,
            mb: 1.5,
            border: '1px solid #1e2a38',
            boxShadow: '0 0 6px #00000050',
            '&:before': { display: 'none' },
            transition: '0.2s',
            '&:hover': {
              boxShadow: '0 0 10px #00bfff33',
              transform: 'scale(1.01)',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#00bfff' }} />}
            sx={{
              '& .MuiAccordionSummary-content': {
                fontWeight: 'bold',
                color: '#fff',
              },
            }}
          >
            {cat.nombre}
          </AccordionSummary>

          <AccordionDetails>
            <List dense>
              {cat.subcategorias?.length > 0 ? (
                cat.subcategorias.map((sub) => (
                  <ListItem
                    key={sub}
                    button
                    component={Link}
                    to={`/search?category=${encodeURIComponent(
                      `${cat.nombre}/${sub}`
                    )}`}
                    sx={{
                      pl: 3,
                      py: 0.8,
                      color: '#ccc',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: '#242b3a',
                        color: '#00bfff',
                      },
                    }}
                  >
                    <ListItemText primary={sub} />
                  </ListItem>
                ))
              ) : (
                <ListItem
                  button
                  component={Link}
                  to={`/search?category=${encodeURIComponent(cat.nombre)}`}
                  sx={{
                    pl: 3,
                    py: 0.8,
                    fontStyle: 'italic',
                    color: '#aaa',
                    '&:hover': {
                      bgcolor: '#242b3a',
                      color: '#00bfff',
                    },
                  }}
                >
                  <ListItemText primary="Ver todos" />
                </ListItem>
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default SidebarCategoryAccordion;
