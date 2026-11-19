import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  addEmployee,
  getEmployeeById,
  updateEmployee,
} from "../components/services/employeeService"

import { getAllDepartments } from "../components/services/departmrntService";

import {
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
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

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    department: { id: '' },
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const deptData = await getAllDepartments();
        setDepartments(deptData);

        if (id) {
          const emp = await getEmployeeById(id);

          setEmployee({
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            age: emp.age || '',
            department: {
              id: emp.department?.id || '',
            },
          });
        }
      } catch (error) {
        setFeedback({ type: 'error', message: 'Failed to load form data' });
        notifyApiError(error, 'Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'department.id') {
      setEmployee((prev) => ({
        ...prev,
        department: { id: value },
      }));
    } else {
      setEmployee((prev) => ({
        ...prev,
        [name]: name === 'age' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      if (id) {
        await updateEmployee(id, employee);
        setFeedback({ type: 'success', message: 'Employee updated successfully' });
        notifySuccess('Employee updated successfully');
      } else {
        await addEmployee(employee);
        setFeedback({ type: 'success', message: 'Employee added successfully' });
        notifySuccess('Employee added successfully');
      }

      navigate('/employees');
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to save employee' });
      notifyApiError(error, 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          maxWidth: 560,
          p: { xs: 2.5, sm: 3.5 },
          boxShadow: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
          border: '1px solid rgba(30,60,114,0.08)',
          '& .MuiTextField-root': {
            width: '100%',
          },
        }}
      >
        <Stack spacing={2.5}>
          <Box textAlign="center">
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
              {id ? 'Edit Employee' : 'Add Employee'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the employee details below to save the record.
            </Typography>
          </Box>

          {feedback.message ? (
            <Alert severity={feedback.type}>{feedback.message}</Alert>
          ) : null}

          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              required
            />

            <TextField
              label="Last Name"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={employee.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Age"
              name="age"
              type="number"
              value={employee.age}
              onChange={handleChange}
              inputProps={{ min: 1, max: 150 }}
              required
            />

            <TextField
              select
              label="Department"
              name="department.id"
              value={employee.department.id}
              onChange={handleChange}
              required
            >
              <MenuItem value="">Select Department</MenuItem>

              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.2 }}>
            {id ? 'Update Employee' : 'Save Employee'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;