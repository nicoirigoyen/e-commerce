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
import logo from './logo.svg'; //logo

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'linear-gradient(-45deg, #152238, #1C2E48, #284266, #1C2E48, #152238)',
          backgroundSize: '600% 600%',
          animation: 'gradientBG 35s ease infinite',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ToastContainer position="bottom-center" limit={1} />

        <AppBar position="static" sx={{ backgroundColor: '#1F2E4A' }}>
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setSidebarIsOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                ml: 1
              }}
            >
             <Box
                component="img"
                src={logo}
                alt=""
                sx={{
                  height: 40,
                  width: 'auto',
                  transition: 'transform 0.3s ease',
                  filter: 'brightness(0) saturate(100%) invert(24%) sepia(85%) saturate(5479%) hue-rotate(355deg) brightness(95%) contrast(106%)',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#D12B19',
                }}
              >
                <Box component="span" sx={{ color: '#D12B19' }}>Ni</Box>
                <Box component="span" sx={{ color: 'white', ml: 0.5 }}>Tecno</Box>
              </Typography>
            </Box>
          </Box>




            <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
              <SearchBox />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button color="inherit" component={Link} to="/cart" sx={{ position: 'relative' }}>
                Carrito
                {cart.cartItems.length > 0 && (
                  <Badge
                    badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#25D366',
                        color: 'white',
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
                    <MenuItem
                      component={Link}
                      to="/profile"
                      sx={{
                        '&:hover': { backgroundColor: '#6B8DD6', color: '#FFFFFF' },
                      }}
                    >
                      Mi Perfil
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/orderhistory"
                      sx={{
                        '&:hover': { backgroundColor: '#6B8DD6', color: '#FFFFFF' },
                      }}
                    >
                      Pedidos
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <>
                        <MenuItem disabled>--- Admin ---</MenuItem>
                        <MenuItem component={Link} to="/admin/dashboard">
                          Panel de usuario
                        </MenuItem>
                        <MenuItem component={Link} to="/admin/products">
                          Productos
                        </MenuItem>
                        <MenuItem component={Link} to="/admin/featured">
                          Featured
                        </MenuItem>
                        <MenuItem component={Link} to="/admin/orders">
                          Pedidos
                        </MenuItem>
                        <MenuItem component={Link} to="/admin/users">
                          Usuarios
                        </MenuItem>
                      </>
                    )}
                    <MenuItem onClick={signoutHandler}>Salir</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" component={Link} to="/signin">
                  Ingresar
                </Button>
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
            onKeyDown={() => setSidebarIsOpen(false)}
            sx={{ width: 250 }}
          >
            <List>
              {categories.map((category) => (
                <ListItem
                  button
                  key={category}
                  component={Link}
                  to={`/search?category=${category}`}
                  sx={{
                    '&:hover': { backgroundColor: '#6B8DD6', color: '#FFFFFF' },
                  }}
                >
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <main>
          <Container sx={{ mt: 3 }}>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/featured"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/featured/create"
                element={
                  <AdminRoute>
                    <FeaturedItemCreateScreen />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>

        <footer>
          <Box
            textAlign="center"
            py={2}
            sx={{ backgroundColor: '#152033', color: 'white' }}
          >
            Todos los derechos reservados
          </Box>
        </footer>
      </Box>
    </BrowserRouter>
  );
}

export default App;
