import React, { useEffect, useState } from 'react';
import './profile.css';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Paper,
  Tooltip,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

import { getAllEmployees } from "../components/services/employeeService";
import { getAllDepartments } from "../components/services/departmrntService";
import { clearSession } from "../components/services/authService";
import useAuth from "../hooks/useAuth";

import ShieldIcon from '@mui/icons-material/Shield';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmailIcon from '@mui/icons-material/Email';

const LoadingOverlay = ({ message }) => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
    }}
  >
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

const Profile = () => {
  const navigate = useNavigate();
  const { authenticated: isLoggedIn, username = "" } = useAuth();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) setShowSnackbar(true);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const employees = await getAllEmployees();
        const departments = await getAllDepartments();

        setEmployeeCount(employees.length);
        setDepartmentCount(departments.length);

        const avg =
          employees.length > 0
            ? (employees.reduce((sum, e) => sum + e.age, 0) / employees.length).toFixed(1)
            : 0;

        setAverageAge(avg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  const handleLogout = () => {
    clearSession();
    setShowSnackbar(true);
    navigate('/login');
  };

  const handleExportSnapshot = () => {
    const email = username ? `${username}@example.com` : 'user@example.com';

    const rows = [
      ['Username', username],
      ['Email', email],
      ['Employees', employeeCount],
      ['Departments', departmentCount],
      ['Average Age', averageAge],
      ['Generated At', new Date().toISOString()],
    ];

    const csv = ['Field,Value', ...rows.map(r => `"${r[0]}","${r[1]}"`)].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-snapshot.csv';
    a.click();

    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => navigate('/login')}
        >
          <Alert severity="warning">
            Please login to view profile
          </Alert>
        </Snackbar>
      </>
    );
  }

  if (loading) return <LoadingOverlay message="Loading profile..." />;

  const email = username ? `${username}@example.com` : 'user@example.com';

  return (
    <Box className="profile-shell">
      <Grid container spacing={{ xs: 2, md: 3 }}>

        {/* LEFT PROFILE CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="profile-card">
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar className="profile-avatar">
                  {username?.[0]?.toUpperCase()}
                </Avatar>

                <Typography variant="h6" fontWeight={700}>
                  {username}
                </Typography>

                <Chip className="profile-chip" icon={<VerifiedUserIcon />} label="Authenticated" color="primary" />

                <Tooltip title={email}>
                  <Chip className="profile-chip" icon={<EmailIcon />} label={email} variant="outlined" />
                </Tooltip>

                <Divider sx={{ width: '100%' }} />

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT DASHBOARD */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card className="profile-card">
            <CardContent>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  Organization Overview
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportSnapshot}
                >
                  Export
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {[
                  { label: 'Employees', value: employeeCount, icon: <ShieldIcon /> },
                  { label: 'Departments', value: departmentCount, icon: <AssessmentIcon /> },
                  { label: 'Avg Age', value: averageAge, icon: <TimelineIcon /> },
                ].map((item) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                    <Paper className="profile-stat-card">
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.icon}
                        <Typography fontWeight={700}>{item.value}</Typography>
                      </Stack>
                      <Typography variant="body2">{item.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* QUICK ACTIONS */}
              <Box mt={3}>
                <Typography fontWeight={700}>Quick Actions</Typography>

                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  <Chip className="profile-action-chip" label="Add Employee" component={Link} to="/add-employee" clickable />
                  <Chip className="profile-action-chip" label="Add Department" component={Link} to="/add-department" clickable />
                  <Chip className="profile-action-chip" label="Dashboard" component={Link} to="/dashboard" clickable />
                </Stack>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;