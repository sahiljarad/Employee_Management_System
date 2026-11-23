import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";



import Grid from "@mui/material/Grid";

import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import DomainAddRoundedIcon from "@mui/icons-material/DomainAddRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import { getAllEmployees } from "../components/services/employeeService";
import { getAllDepartments } from "../components/services/departmrntService";
import { getUsername } from "../components/services/authService";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [ageRangeData, setAgeRangeData] = useState({});
  const [recentEmployees, setRecentEmployees] = useState([]);

  const [employeeGrowth] = useState([
    { month: "Jan", count: 50 },
    { month: "Feb", count: 70 },
    { month: "Mar", count: 100 },
    { month: "Apr", count: 130 },
    { month: "May", count: 160 },
    { month: "Jun", count: 200 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const employees = (await getAllEmployees()) || [];
        const departments = (await getAllDepartments()) || [];

        setEmployeeCount(employees.length);
        setDepartmentCount(departments.length);

        const validEmployees = employees.filter((e) => e?.age);

        const totalAge = validEmployees.reduce(
          (sum, emp) => sum + (emp.age || 0),
          0
        );

        const avg =
          validEmployees.length > 0 ? totalAge / validEmployees.length : 0;

        setAverageAge(avg.toFixed(1));

        const ranges = {
          "20-29": 0,
          "30-39": 0,
          "40-49": 0,
          "50-59": 0,
          "60+": 0,
        };

        employees.forEach((emp) => {
          const age = emp?.age;

          if (!age) return;

          if (age >= 20 && age <= 29) ranges["20-29"]++;
          else if (age <= 39) ranges["30-39"]++;
          else if (age <= 49) ranges["40-49"]++;
          else if (age <= 59) ranges["50-59"]++;
          else ranges["60+"]++;
        });

        setAgeRangeData(ranges);

        const recent = [...employees]
          .sort((a, b) => (b?.id || 0) - (a?.id || 0))
          .slice(0, 5);

        setRecentEmployees(recent);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const username = getUsername() || "User";

  const ageChart = {
    labels: Object.keys(ageRangeData),
    datasets: [
      {
        label: "Employees by Age",
        data: Object.values(ageRangeData),
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#AB47BC", "#26C6DA"],
        borderWidth: 1,
      },
    ],
  };

  const growthChart = {
    labels: employeeGrowth.map((e) => e.month),
    datasets: [
      {
        label: "Employee Growth",
        data: employeeGrowth.map((e) => e.count),
        backgroundColor: "#66BB6A",
        borderRadius: 6,
      },
    ],
  };

  const overviewChart = {
    labels: ["Employees", "Departments"],
    datasets: [
      {
        label: "Overview",
        data: [employeeCount, departmentCount],
        backgroundColor: ["#3f51b5", "#ff9800"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: { xs: 2, md: 4 },
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard insights...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, lg: 3 },
        overflowX: "hidden",
        borderRadius: { xs: 0, md: 4 },
        background: "linear-gradient(135deg, rgba(248,251,255,0.95) 0%, rgba(238,244,255,0.95) 100%)",
        minHeight: "78vh",
      }}
    >
      <Card
        sx={{
          mb: { xs: 3, md: 4 },
          borderRadius: 4,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          background: "linear-gradient(135deg, #102645 0%, #1E3C72 55%, #2A5298 100%)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={2.5}
          >
            <Box sx={{ maxWidth: { lg: 700 } }}>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" }, wordBreak: "break-word" }}>
                Welcome back, {username} 👋
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.82)" }}>
                Monitor employee strength, department coverage, and team growth
                from a modern, responsive dashboard.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                startIcon={<PersonAddAltRoundedIcon />}
                onClick={() => navigate("/add-employee")}
                size={isMobile ? "small" : "medium"}
              >
                Add Employee
              </Button>

              <Button
                variant="outlined"
                startIcon={<DomainAddRoundedIcon />}
                onClick={() => navigate("/add-department")}
                size={isMobile ? "small" : "medium"}
              >
                Add Department
              </Button>

              <Button
                variant="outlined"
                startIcon={<ListAltIcon />}
                onClick={() => navigate("/employees")}
                size={isMobile ? "small" : "medium"}
              >
                View Employees
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: 2,
              transition: "0.2s ease",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ color: "rgba(15,23,42,0.68)", mb: 0.5 }} variant="body2">
                    Total Employees
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {employeeCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "linear-gradient(135deg, #1E3C72, #2A5298)" }}>
                  <PeopleAltRoundedIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: 2,
              transition: "0.2s ease",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ color: "rgba(15,23,42,0.68)", mb: 0.5 }} variant="body2">
                    Total Departments
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {departmentCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "linear-gradient(135deg, #f59e0b, #fb923c)" }}>
                  <BusinessRoundedIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: 2,
              transition: "0.2s ease",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ color: "rgba(15,23,42,0.68)", mb: 0.5 }} variant="body2">
                    Average Age
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {averageAge}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "linear-gradient(135deg, #16a34a, #22c55e)" }}>
                  <InsightsRoundedIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Overview
              </Typography>
              <Box sx={{ height: { xs: 240, sm: 280, lg: 300 }, position: "relative" }}>
                <Bar data={overviewChart} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Age Distribution
              </Typography>
              <Box sx={{ height: { xs: 240, sm: 280, lg: 300 }, position: "relative" }}>
                <Pie data={ageChart} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Employee Growth
              </Typography>
              <Box sx={{ height: { xs: 240, sm: 280, lg: 300 }, position: "relative" }}>
                <Bar data={growthChart} options={barOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 2, background: "rgba(255,255,255,0.92)", border: "1px solid rgba(30,60,114,0.08)" }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Recent Employees
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Newly added team members
              </Typography>
            </Box>

            <Button
              variant="text"
              onClick={() => navigate("/employees")}
              size="small"
            >
              View all
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {recentEmployees.length === 0 ? (
            <Box
              sx={{
                p: 3,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                No recent employees yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Add your first employee to populate this section.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {recentEmployees.map((emp) => (
                <Box
                  key={emp?.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      {(emp?.firstName || "U").charAt(0)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        {emp?.firstName} {emp?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {emp?.department?.name || "Unassigned department"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={emp?.age ? `${emp.age} yrs` : "Age pending"}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;