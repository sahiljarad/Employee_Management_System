import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllDepartments,
  deleteDepartment,
} from "../components/services/departmrntService";
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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
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
      gap: 1.2,
      py: 4,
    }}
  >
    <CircularProgress />
    <Typography color="text.secondary">{message}</Typography>
  </Box>
);

const DepartmentList = () => {
  const { authenticated: isLoggedIn } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [denseRows, setDenseRows] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllDepartments();
        setDepartments(data || []);
      } catch (error) {
        notifyApiError(error, 'Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((dep) => dep.id !== id));
      notifyInfo('Department deleted');
    } catch (error) {
      notifyApiError(error, 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(String(id));
  };

  const handleExportCsv = () => {
    const header = ['Name', 'ID'];
    const rows = departments.map((d) => [d.name, d.id]);

    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${v ?? ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'departments.csv';
    a.click();

    URL.revokeObjectURL(url);
  };

  const filteredDepartments = departments
    .filter((d) => d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  if (loading) {
    return <LoadingOverlay message="Loading departments..." />;
  }

  if (!isLoggedIn) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5, px: 2 }}>
        <Typography variant="h6">Please login to view departments</Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to manage company departments.
        </Typography>
      </Box>
    );
  }

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
            Departments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage all departments in one place.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCsv} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Export CSV
          </Button>

          <Button variant="contained" component={Link} to="/add-department" startIcon={<AddIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Add Department
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Chip label={`Total: ${departments.length}`} />
        <Chip label={`Visible: ${filteredDepartments.length}`} />
      </Stack>

      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Search department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortDirection}
                label="Sort"
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <MenuItem value="asc">A-Z</MenuItem>
                <MenuItem value="desc">Z-A</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={denseRows}
                  onChange={(e) => setDenseRows(e.target.checked)}
                />
              }
              label="Compact"
            />
          </Stack>
        </Stack>
      </Paper>

      {isMobile ? (
        <Stack spacing={1.5}>
          {filteredDepartments
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((dep) => (
              <Paper key={dep.id} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography fontWeight={600}>{dep.name}</Typography>
                  <Tooltip title="Copy ID">
                    <Button size="small" onClick={() => handleCopyId(dep.id)}>
                      <ContentCopyIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  ID: {dep.id}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button variant="outlined" component={Link} to={`/edit-department/${dep.id}`}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(dep.id)}
                    disabled={deletingId === dep.id}
                  >
                    {deletingId === dep.id ? <CircularProgress size={16} /> : 'Delete'}
                  </Button>
                </Stack>
              </Paper>
            ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)', border: '1px solid rgba(30,60,114,0.08)' }}>
          <Table size={denseRows ? 'small' : 'medium'} sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDepartments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((dep) => (
                  <TableRow key={dep.id} hover>
                    <TableCell>{dep.name}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {dep.id}
                        <Tooltip title="Copy ID">
                          <Button size="small" onClick={() => handleCopyId(dep.id)}>
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" component={Link} to={`/edit-department/${dep.id}`}>
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(dep.id)}
                          disabled={deletingId === dep.id}
                        >
                          {deletingId === dep.id ? <CircularProgress size={16} /> : 'Delete'}
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
        count={filteredDepartments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
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

export default DepartmentList;