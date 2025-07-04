import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import ServicioTecnicoScreen from './screens/ServicioTecnicoScreen';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import FeaturedItemCreateScreen from './screens/FeaturedItemCreateScreen';
import logo from './logo.svg';
import AnimatedBackground from './components/AnimatedBackground';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.clear();
    window.location.href = '/signin';
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Colocar esto arriba, antes del return
  const SidebarContent = (
    <Box
      sx={{
        width: { xs: '100%', sm: 320 },
        bgcolor: '#1C2E48',
        height: '100%',
        color: 'white',
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Categorías
      </Typography>

      {/* Secciones PC / Notebook / Componentes... (las que ya tenés) */}
      {/* Copiá tal cual lo que ya tenés dentro del Drawer acá */}

      {/* Servicio Técnico */}
      <List sx={{ mt: 3 }}>
        <ListItem
          button
          component={Link}
          to="/servicio-tecnico"
          sx={{
            bgcolor: '#D12B19',
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#FF3B3B',
              color: '#fff',
            },
          }}
        >
          <ListItemText
            primary="Servicio Técnico"
            primaryTypographyProps={{
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

 /*const CategoryMenu = () => (
    <Box
      sx={{
        display: isMobile ? 'none' : 'flex',
        gap: 3,
        justifyContent: 'center',
        bgcolor: '#1C2E48',
        py: 1,
        borderBottom: '2px solid #152033',
        flexWrap: 'wrap',
      }}
    >
      <Button component={Link} to="/search?category=Gaming" sx={{ color: 'white' }}>
        PC Gaming
      </Button>
      <Button component={Link} to="/search?category=Escritorio" sx={{ color: 'white' }}>
        PC Escritorio
      </Button>
      <Button component={Link} to="/search?category=Notebook-Gaming" sx={{ color: 'white' }}>
        Notebook Gaming
      </Button>
      <Button component={Link} to="/search?category=Notebook-Uso-General" sx={{ color: 'white' }}>
        Notebook Uso General
      </Button>
      <Button component={Link} to="/search?category=Procesadores" sx={{ color: 'white' }}>
        Procesadores
      </Button>
      <Button component={Link} to="/search?category=PlacasDeVideo" sx={{ color: 'white' }}>
        Placas de Video
      </Button>
      <Button component={Link} to="/search?category=MemoriasRAM" sx={{ color: 'white' }}>
        Memorias RAM
      </Button>
      <Button
        component={Link}
        to="/servicio-tecnico"
        sx={{
          bgcolor: '#D12B19',
          color: 'white',
          fontWeight: 'bold',
          px: 2,
          borderRadius: 1,
          '&:hover': { bgcolor: '#FF3B3B' },
        }}
      >
        Servicio Técnico
      </Button>
    </Box>
  );*/

    // Flag: mostrará u ocultará el banner
    const showBanner = true;           // ← ponelo en false si no querés que aparezca

    // Banner animado
    const Banner = () => (
      <Box
        sx={{
          width: '100%',
          bgcolor: '#0D47A1',       // azul neon; cambialo si querés otro tono
          color: 'white',
          overflow: 'hidden',
          py: 1,
        }}
      >
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            animation: 'marquee 18s linear infinite',
            fontWeight: 'bold',
            fontSize: { xs: '0.8rem', sm: '1rem' },
            px: 2,
          }}
        >
          🔥 ¡Envíos gratis en compras mayores a $150.000! — 💳 3 y 6 cuotas sin interés — 📞
          Consultas por WhatsApp 351‑XXX‑XXXX —
        </Typography>

        {/* Animación marquee */}
        <style>
          {`
            @keyframes marquee {
              0%   { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </Box>
    );

  return (
    <BrowserRouter>
      <AnimatedBackground />
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ToastContainer position="bottom-center" limit={1} />

        <AppBar position="static" sx={{ backgroundColor: '#1F2E4A' }}>
          {/*!isMobile && <CategoryMenu />*/} 
          {/* Banner animado opcional */}
          {showBanner && <Banner />}
          <Toolbar
            sx={{
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 1 : 0,
              py: isMobile ? 1 : 0,
              justifyContent: isMobile ? 'flex-start' : 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <IconButton color="inherit" onClick={() => setSidebarIsOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Box
                  component="img"
                  src={logo}
                  alt="logo"
                  sx={{ height: 40, ml: 1, transition: 'transform 0.3s ease', filter: 'invert(24%) sepia(85%) saturate(5479%) hue-rotate(355deg)', '&:hover': { transform: 'scale(1.2)' } }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, color: 'white' }}>
                  <Box component="span">Ni</Box>
                  <Box component="span" sx={{ color: '#D12B19' }}>Tecno</Box>
                </Typography>
              </Link>
            </Box>
            
            {/* Sidebar para dispositivos móviles */}
            <Drawer anchor="left" open={sidebarIsOpen} onClose={() => setSidebarIsOpen(false)}>
              <Box role="presentation" onClick={() => setSidebarIsOpen(false)}>
                {SidebarContent}
              </Box>
            </Drawer>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              <Button color="inherit" component={Link} to="/cart" sx={{ position: 'relative' }}>
                Carrito
                {cart.cartItems.length > 0 && (
                  <Badge
                    badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#25D366', color: '#fff', fontSize: '0.75rem' } }}
                  />
                )}
              </Button>
              {userInfo ? (
                <>
                  <Button color="inherit" onClick={handleMenu}>{userInfo.name}</Button>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem component={Link} to="/profile">Mi Perfil</MenuItem>
                    <MenuItem component={Link} to="/orderhistory">Pedidos</MenuItem>
                    {userInfo.isAdmin && (
                      <>
                        <MenuItem disabled>--- Admin ---</MenuItem>
                        <MenuItem component={Link} to="/admin/dashboard">Dashboard</MenuItem>
                        <MenuItem component={Link} to="/admin/products">Productos</MenuItem>
                        <MenuItem component={Link} to="/admin/orders">Pedidos</MenuItem>
                        <MenuItem component={Link} to="/admin/users">Usuarios</MenuItem>
                      </>
                    )}
                    <MenuItem onClick={signoutHandler}>Salir</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" component={Link} to="/signin">Ingresar</Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
            anchor="left"
            open={sidebarIsOpen}
            onClose={() => setSidebarIsOpen(false)}
          >
            <Box
              role="presentation"
              onClick={() => setSidebarIsOpen(false)}
              sx={{
                width: { xs: '100%', sm: 320 },
                bgcolor: '#1C2E48',
                height: '100%',
                color: 'white',
                padding: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Categorías
              </Typography>

              {/* Sección PC */}
              <Accordion sx={{ bgcolor: 'transparent', color: 'white' }}>
                <AccordionSummary expandIcon={<MenuIcon sx={{ color: '#25D366' }} />}>
                  <Typography sx={{ fontWeight: 'bold' }}>PC</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem button component={Link} to="/search?category=Gaming">
                      <ListItemText primary="Gaming" />
                    </ListItem>
                    <ListItem button component={Link} to="/search?category=Escritorio">
                      <ListItemText primary="Escritorio" />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Sección Notebook */}
              <Accordion sx={{ bgcolor: 'transparent', color: 'white' }}>
                <AccordionSummary expandIcon={<MenuIcon sx={{ color: '#25D366' }} />}>
                  <Typography sx={{ fontWeight: 'bold' }}>Notebook</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem button component={Link} to="/search?category=Notebook-Gaming">
                      <ListItemText primary="Gaming" />
                    </ListItem>
                    <ListItem button component={Link} to="/search?category=Notebook-Uso-General">
                      <ListItemText primary="Uso General" />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Sección Componentes */}
              <Accordion sx={{ bgcolor: 'transparent', color: 'white' }}>
                <AccordionSummary expandIcon={<MenuIcon sx={{ color: '#25D366' }} />}>
                  <Typography sx={{ fontWeight: 'bold' }}>Componentes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem button component={Link} to="/search?category=Procesadores">
                      <ListItemText primary="Procesadores" />
                    </ListItem>
                    <ListItem button component={Link} to="/search?category=PlacasDeVideo">
                      <ListItemText primary="Placas de Video" />
                    </ListItem>
                    <ListItem button component={Link} to="/search?category=MemoriasRAM">
                      <ListItemText primary="Memorias RAM" />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Servicio Técnico */}
              <List sx={{ mt: 3 }}>
                <ListItem
                  button
                  component={Link}
                  to="/servicio-tecnico"
                  sx={{
                    bgcolor: '#D12B19',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#FF3B3B',
                      color: '#fff',
                    },
                  }}
                >
                  <ListItemText
                    primary="Servicio Técnico"
                    primaryTypographyProps={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Drawer>


       <main>
          <Container
              sx={{
                mt: 3,
                // ya no dejamos margen porque quitamos el sidebar fijo
                transition: 'margin-left 0.3s ease',
              }}
            >
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/servicio-tecnico" element={<ServicioTecnicoScreen />} />
              
              <Route path="/admin/products" element={<ProductScreen /* mal */ />} />
              <Route path="/admin/dashboard" element={<DashboardScreen /* mal */ />} />
              <Route path="/admin/orders" element={<OrderScreen /* mal */  />} />
              <Route path="/admin/users" element={<UserEditScreen /* mal */ />} />
            </Routes>
          </Container>
        </main>


        <footer>
          <Box textAlign="center" py={2} sx={{ backgroundColor: '#152033', color: 'white', mt: 'auto' }}>
            Todos los derechos reservados © {new Date().getFullYear()}
          </Box>
        </footer>
      </Box>
    </BrowserRouter>
  );
}

export default App;
