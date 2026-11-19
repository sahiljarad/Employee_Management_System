import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addDepartment,
  getDepartmentById,
  updateDepartment,
} from "../components/services/departmrntService";

import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Paper,
  Stack,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const notifySuccess = (message) => {
  console.info(message);
};

const notifyApiError = (error, fallback) => {
  console.error(fallback, error);
};

const DepartmentForm = () => {
  const [department, setDepartment] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const data = await getDepartmentById(id);
        setDepartment(data);
      } catch (error) {
        setFeedback({
          type: 'error',
          message: 'We could not load this department. Please try again.',
        });
        notifyApiError(
          error,
          'We could not load this department. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      if (id) {
        await updateDepartment(id, department);
        setFeedback({ type: 'success', message: 'Department updated successfully.' });
        notifySuccess('Department updated successfully.');
      } else {
        await addDepartment(department);
        setFeedback({ type: 'success', message: 'Department created successfully.' });
        notifySuccess('Department created successfully.');
      }

      navigate('/departments');
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `We could not ${id ? 'update' : 'create'} this department.`,
      });
      notifyApiError(
        error,
        `We could not ${id ? 'update' : 'create'} this department.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        background: 'linear-gradient(135deg, rgba(248,251,255,0.95) 0%, rgba(238,244,255,0.95) 100%)',
        borderRadius: { xs: 0, md: 4 },
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          boxShadow: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
          border: '1px solid rgba(30,60,114,0.08)',
        }}
      >
        <Stack spacing={2.5}>
          <Box textAlign="center">
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
              {id ? 'Edit Department' : 'Add Department'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep department details up to date in a few seconds.
            </Typography>
          </Box>

          {feedback.message ? (
            <Alert severity={feedback.type}>{feedback.message}</Alert>
          ) : null}

          <TextField
            label="Department Name"
            name="name"
            value={department.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.2 }}>
            {id ? 'Update Department' : 'Save Department'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DepartmentForm;