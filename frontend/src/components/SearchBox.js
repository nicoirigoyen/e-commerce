// components/SearchBox.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <motion.div
      initial={{ width: 200 }}
      animate={{ width: focused ? 350 : 200 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        component="form"
        onSubmit={submitHandler}
        sx={{
          p: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 5,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
        elevation={focused ? 5 : 2}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar productos..."
          inputProps={{ 'aria-label': 'buscar productos' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="buscar">
          <SearchIcon />
        </IconButton>
      </Paper>
    </motion.div>
  );
}
