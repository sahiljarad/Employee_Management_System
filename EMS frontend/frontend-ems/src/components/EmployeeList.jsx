import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  getAllEmployees,
  deleteEmployee,
} from "../components/services/employeeService";

import { getAllDepartments } from "../components/services/departmrntService";
import useAuth from '../hooks/useAuth';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Box,
  CircularProgress,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DownloadIcon from '@mui/icons-material/Download';

const notifyInfo = (message) => {
  console.info(message);
};

const notifyApiError = (error, fallback) => {
  console.error(fallback, error);
};

const LoadingOverlay = ({ message }) => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1.5,
      py: 4,
    }}
  >
    <CircularProgress />
    <Typography color="text.secondary">{message}</Typography>
  </Box>
);


const EmployeeList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { authenticated: isLoggedIn } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [denseRows, setDenseRows] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const emp = await getAllEmployees();
        const dep = await getAllDepartments();

        setEmployees(emp);
        setDepartments(dep);
      } catch (error) {
        notifyApiError(error, 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      notifyInfo('Employee deleted');
    } catch (error) {
      notifyApiError(error, 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (email) => {
    navigator.clipboard?.writeText(email);
  };

  const handleMail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const filtered = employees
    .filter(e => {
      const matchSearch =
        `${e.firstName} ${e.lastName} ${e.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchDept =
        departmentFilter === 'all' ||
        String(e.department?.id) === departmentFilter;

      const matchAge =
        ageFilter === 'all' ||
        (ageFilter === 'under30' && e.age < 30) ||
        (ageFilter === '30to45' && e.age >= 30 && e.age <= 45) ||
        (ageFilter === '45plus' && e.age > 45);

      return matchSearch && matchDept && matchAge;
    })
    .sort((a, b) => {
      if (sortBy === 'age') return (a.age || 0) - (b.age || 0);
      if (sortBy === 'department')
        return (a.department?.name || '').localeCompare(
          b.department?.name || ''
        );

      return `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`
      );
    });

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getInitials = (f, l) =>
    `${f?.[0] || ''}${l?.[0] || ''}`.toUpperCase();

  if (loading) return <LoadingOverlay message="Loading employees..." />;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        maxWidth: '100%',
        overflowX: 'hidden',
        background: 'linear-gradient(135deg, rgba(248,251,255,0.95) 0%, rgba(238,244,255,0.95) 100%)',
        borderRadius: { xs: 0, md: 4 },
        minHeight: '78vh',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employees
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage employee records and contact details.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => window.print()} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Export
          </Button>

          <Button
            variant="contained"
            component={Link}
            to="/add-employee"
            startIcon={<PersonAddAltIcon />}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Employee
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Search employees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Age</InputLabel>
              <Select
                value={ageFilter}
                label="Age"
                onChange={(e) => setAgeFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="under30">Under 30</MenuItem>
                <MenuItem value="30to45">30–45</MenuItem>
                <MenuItem value="45plus">45+</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="department">Department</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={denseRows}
                onChange={(e) => setDenseRows(e.target.checked)}
              />
            }
            label="Compact view"
          />
        </Stack>
      </Paper>

      {isMobile ? (
        <Stack spacing={1.5}>
          {paginated.map((emp) => (
            <Paper key={emp.id} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getInitials(emp.firstName, emp.lastName)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={600} noWrap>
                    {emp.firstName} {emp.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {emp.department?.name || 'Unassigned'}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 1.5 }} />

              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Email:</strong> {emp.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Age:</strong> {emp.age}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                <Button size="small" onClick={() => handleMail(emp.email)} startIcon={<EmailIcon />}>
                  Mail
                </Button>
                <Button size="small" onClick={() => handleCopy(emp.email)} startIcon={<ContentCopyIcon />}>
                  Copy
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(emp.id)} disabled={deletingId === emp.id}>
                  {deletingId === emp.id ? <CircularProgress size={16} /> : 'Delete'}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
          <Table size={denseRows ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar>{getInitials(emp.firstName, emp.lastName)}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{emp.firstName} {emp.lastName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {emp.department?.name || 'Unassigned'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department?.name || 'Unassigned'}</TableCell>
                  <TableCell>{emp.age}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button size="small" onClick={() => handleMail(emp.email)} startIcon={<EmailIcon />}>
                        Mail
                      </Button>
                      <Button size="small" onClick={() => handleCopy(emp.email)} startIcon={<ContentCopyIcon />}>
                        Copy
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(emp.id)} disabled={deletingId === emp.id}>
                        {deletingId === emp.id ? <CircularProgress size={16} /> : 'Delete'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Rows"
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default EmployeeList;