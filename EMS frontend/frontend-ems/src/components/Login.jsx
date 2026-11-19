import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { setSession } from "../components/services/authService";
import {
  setSession,
  clearSession
} from "../components/services/authService";

const API_BASE = "http://localhost:8088/api/auth";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const rawMessage = await response.text();

      if (response.ok) {
        let data = {};

        try {
          data = rawMessage ? JSON.parse(rawMessage) : {};
        } catch {
          data = {};
        }

        const token = data.token || data.accessToken;

        if (!token) {
          alert("Login succeeded but no token was returned.");
          return;
        }

        setSession(token, username.trim());
        navigate("/dashboard");
      } else {
        alert(rawMessage || "Login failed. Please check your credentials.");
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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #396195 0%, #1f3d75 45%, #275584 100%)",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 430,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg,#0f172a 0%,#1E3C72 50%,#2A5298 100%)",
            color: "#841e1e",
            py: 4,
            px: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 6px rgba(0,0,0,.3)",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: "rgba(8, 4, 4, 0.92)",
            }}
          >
            Sign in to continue to your EMS Dashboard
          </Typography>
        </Box>

        {/* Form */}
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg,#1976d2,#1565c0)",
                  boxShadow: "0 10px 20px rgba(25,118,210,.35)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1565c0,#0d47a1)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Don't have an account?
            </Typography>

            <Button
              variant="text"
              onClick={() => navigate("/register")}
              sx={{
                mt: 1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Create Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;