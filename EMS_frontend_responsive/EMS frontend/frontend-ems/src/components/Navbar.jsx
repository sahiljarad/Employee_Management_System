import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import useMediaQuery from '@mui/material/useMediaQuery';

import useAuth from '../hooks/useAuth';
import { clearSession } from '../components/services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:991px)');
  const { authenticated: isLoggedIn, username = '' } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const handleLogout = () => {
    clearSession();
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate('/login');
  };

  const navItems = isLoggedIn
    ? [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Employees', path: '/employees', icon: <PeopleIcon /> },
        { label: 'Departments', path: '/departments', icon: <BusinessIcon /> },
        { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
      ]
    : [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Login', path: '/login', icon: <LoginIcon /> },
      ];

  const drawer = (
    <Box sx={{ width: 260, height: '100%', bgcolor: '#0f172a', color: 'white' }}>
      <Box sx={{ px: 2, py: 3, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Typography variant="h6" fontWeight={700}>
          EMS Portal
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.75)" sx={{ mt: 0.5 }}>
          {isLoggedIn ? `Signed in as ${username || 'user'}` : 'Welcome'}
        </Typography>
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            button
            component={Link}
            to={item.path}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? '#ff9800' : 'white', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ color: isActive(item.path) ? '#ff9800' : 'white' }}
            />
          </ListItem>
        ))}

        {isLoggedIn && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.14)', my: 1 }} />
            <ListItem
              button
              onClick={() => {
                setDrawerOpen(false);
                handleLogout();
              }}
            >
              <ListItemIcon sx={{ color: '#f87171', minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#f87171' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1200,
          background: 'linear-gradient(135deg, #102645 0%, #1E3C72 55%, #2A5298 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, px: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              letterSpacing: 0.5,
            }}
          >
            EMS
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? '#ff9800' : 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 1.25,
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {isLoggedIn ? (
                <>
                  <Button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
                  >
                    Account
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        navigate('/profile');
                      }}
                    >
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 1.5,
                    border: '1px solid rgba(255,255,255,0.24)',
                    borderRadius: 999,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;