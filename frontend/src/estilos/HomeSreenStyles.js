import { Box, Typography, Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export const HomeContainer = ({ children }) => (
  <Box sx={{ p: 2 }}>
    {children}
  </Box>
);

export const SectionTitle = ({ children }) => (
  <Typography variant="h5" fontWeight="bold" mb={2}>
    {children}
  </Typography>
);

export const ProductContainer = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      gap: 2,
      pb: 1,
      mb: 5,
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      '&::-webkit-scrollbar': {
        height: 8,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: 10,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
      },
    }}
  >
    {children}
  </Box>
);

export const WhatsAppButton = () => (
  <Fab
    href="https://wa.me/1234567890"
    target="_blank"
    rel="noopener noreferrer"
    color="success"
    sx={{
      position: 'fixed',
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      zIndex: 10,
      bgcolor: '#25d366',
      '&:hover': {
        bgcolor: '#128c7e',
      },
    }}
  >
    <WhatsAppIcon sx={{ fontSize: 30, color: '#fff' }} />
  </Fab>
);
