import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={submitHandler}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 5,
        boxShadow: 3,
        px: 2,
        py: 0.5,
        backgroundColor: '#1a1a1a',
        color: '#fff',
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          color: 'inherit',
          '::placeholder': {
            color: '#ccc',
          },
        }}
        placeholder="Buscar productos..."
        inputProps={{ 'aria-label': 'buscar productos' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px', color: '#25D366' }} aria-label="buscar">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
