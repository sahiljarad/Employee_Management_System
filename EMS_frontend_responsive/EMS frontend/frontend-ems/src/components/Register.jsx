import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:8088/api/auth";
const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8088"}/api/auth`;

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const message = await response.text();

      if (response.ok) {
        alert("Registration Successful");
        navigate("/login");
      } else {
        alert(message || "Registration failed.");
      }
    } catch (error) {
      alert("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #c27d41 0%, #bf8d23 45%, #9e9744 100%)",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 2.5, sm: 3.5, md: 4 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 4,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
          overflow: "hidden",
          border: "1px solid rgba(30, 60, 114, 0.08)",
        }}
      >
        <Box
          sx={{
            bgcolor: "linear-gradient(135deg, #102645 0%, #1E3C72 55%, #2A5298 100%)",
            color: "common.white",
            px: { xs: 3, sm: 4 },
            py: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Join EMS and manage your team efficiently
          </Typography>
        </Box>

        <CardContent sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{ py: 1.2, borderRadius: 999 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 0.5 }}
            >
              Sign in
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;