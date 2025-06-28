import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
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

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.clear();
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      {/* Fondo animado en zIndex 0 */}
      <AnimatedBackground />

      {/* Contenido principal en zIndex alto para estar encima */}
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

        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#1F2E4A' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <IconButton color="inherit" onClick={() => setSidebarIsOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Box
                  component="img"
                  src={logo}
                  alt="logo"
                  sx={{
                    height: 40,
                    ml: 1,
                    transition: 'transform 0.3s ease',
                    filter: 'invert(24%) sepia(85%) saturate(5479%) hue-rotate(355deg)',
                    '&:hover': { transform: 'scale(1.2)' },
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, color: 'white' }}>
                  <Box component="span">Ni</Box>
                  <Box component="span" sx={{ color: '#D12B19' }}>Tecno</Box>
                </Typography>
              </Link>
            </Box>

            <Box sx={{ flex: 2, justifyContent: 'center', display: 'flex' }}>
              <SearchBox />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              <Button color="inherit" component={Link} to="/cart" sx={{ position: 'relative' }}>
                Carrito
                {cart.cartItems.length > 0 && (
                  <Badge
                    badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#25D366',
                        color: '#fff',
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                )}
              </Button>
              {userInfo ? (
                <>
                  <Button color="inherit" onClick={handleMenu}>
                    {userInfo.name}
                  </Button>
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

        {/* Sidebar */}
        <Drawer anchor="left" open={sidebarIsOpen} onClose={() => setSidebarIsOpen(false)}>
          <Box
            role="presentation"
            onClick={() => setSidebarIsOpen(false)}
            sx={{ width: 250, bgcolor: '#1C2E48', height: '100%', color: 'white' }}
          >
            <List>
              {categories.map((category) => (
                <ListItem
                  button
                  key={category}
                  component={Link}
                  to={`/search?category=${category}`}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#6B8DD6',
                      color: '#fff',
                    },
                  }}
                >
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main */}
        <main>
          <Container sx={{ mt: 3 }}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              {/* ...resto de rutas */}
            </Routes>
          </Container>
        </main>

        {/* Footer */}
        <footer>
          <Box
            textAlign="center"
            py={2}
            sx={{ backgroundColor: '#152033', color: 'white', mt: 'auto' }}
          >
            Todos los derechos reservados © {new Date().getFullYear()}
          </Box>
        </footer>
      </Box>
    </BrowserRouter>
  );
}

export default App;
