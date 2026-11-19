import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Employees', to: '/employees' },
  { label: 'Departments', to: '/departments' },
  { label: 'Profile', to: '/profile' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: 0,
        py: { xs: 5, md: 7 },
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 48%, #1e293b 100%)',
        color: '#f8fafc',
        boxShadow: '0 -12px 35px rgba(2, 6, 23, 0.24)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(96, 165, 250, 0.16), transparent 35%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.16), transparent 30%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 2.2, md: 2.8, lg: 3 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25 }}>
                Employee Management Hub
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.75 }}>
                A modern, reliable workspace for managing employees, departments, and team operations with clarity and speed.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: 'rgba(96,165,250,0.16)', color: '#bfdbfe', fontSize: '0.8rem' }}>
                  Secure
                </Box>
                <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: 'rgba(249,115,22,0.16)', color: '#fdba74', fontSize: '0.8rem' }}>
                  Fast
                </Box>
                <Box sx={{ px: 1.2, py: 0.6, borderRadius: 999, bgcolor: 'rgba(34,197,94,0.16)', color: '#86efac', fontSize: '0.8rem' }}>
                  Scalable
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Quick Links
              </Typography>
              <Grid container spacing={0.8}>
                {footerLinks.map((link) => (
                  <Grid item xs={6} key={link.label}>
                    <Link
                      component={RouterLink}
                      to={link.to}
                      color="inherit"
                      underline="none"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: '100%',
                        color: 'rgba(248, 250, 252, 0.84)',
                        transition: 'color 0.2s ease, transform 0.2s ease',
                        '&:hover': { color: '#f59e0b', transform: 'translateX(3px)' },
                      }}
                    >
                      {link.label}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Contact Us
              </Typography>
              <Stack spacing={1.05} sx={{ color: 'rgba(248, 250, 252, 0.84)' }}>
                <Typography variant="body2">
                  Maintainer:{' '}
                  <Link href="https://github.com/hoangsonww" target="_blank" rel="noreferrer" color="inherit" sx={{ textDecoration: 'underline', '&:hover': { color: '#f59e0b' } }}>
                    Son Nguyen
                  </Link>
                </Typography>
                <Typography variant="body2">
                  Email:{' '}
                  <Link href="mailto:hoangson091104@gmail.com" color="inherit" sx={{ textDecoration: 'underline', '&:hover': { color: '#f59e0b' } }}>
                    hoangson091104@gmail.com
                  </Link>
                </Typography>
                <Typography variant="body2">Phone: +1 (123) 456-7890</Typography>
                <Typography variant="body2">Address: 123 Employee St, Suite 100, New York, NY 10001</Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.2,
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            mt: { xs: 3.2, md: 4.2 },
            pt: 2.1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.72)' }}>
            © {new Date().getFullYear()} Employee Management System. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.68)' }}>
            Built for modern teams and growing operations.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;