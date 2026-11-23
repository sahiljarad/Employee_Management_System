import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';

/* Components */
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

/* ---------------- APP CONTENT ---------------- */
const AppContent = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const hideNavbar = isLanding || isAuthPage;
  const fullBleed = isLanding || isAuthPage;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        overflowX: 'hidden',
        background: isLanding
          ? 'transparent'
          : 'linear-gradient(135deg, #174787 0%, #eef4ff 45%, #f8fafc 100%)',
      }}
    >
      {!hideNavbar && <Navbar />}

      <Container
        maxWidth={fullBleed ? false : 'xl'}
        disableGutters={fullBleed}
        sx={{
          mt: fullBleed ? 0 : { xs: 1.5, md: 3, lg: 4 },
          mb: fullBleed ? 0 : { xs: 2, md: 4, lg: 5 },
          px: fullBleed ? 0 : { xs: 1.5, sm: 2, md: 3, lg: 4 },
          pb: fullBleed ? 0 : { xs: 2, md: 3, lg: 4 },
        }}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/add-employee" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
          <Route path="/edit-employee/:id" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />

          <Route path="/departments" element={<ProtectedRoute><DepartmentList /></ProtectedRoute>} />
          <Route path="/add-department" element={<ProtectedRoute><DepartmentForm /></ProtectedRoute>} />
          <Route path="/edit-department/:id" element={<ProtectedRoute><DepartmentForm /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Container>

      <Footer />
    </Box>
  );
};

/* ---------------- MAIN APP ---------------- */
const App = () => {
  useEffect(() => {
    // safe empty effect (remove warmUpBackend if not needed)
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppContent />

      <ToastContainer
        position="bottom-center"
        autoClose={4500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 20000 }}
      />
    </ThemeProvider>
  );
};

export default App;