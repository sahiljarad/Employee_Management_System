import { useEffect, useState } from "react";
import { getUsername, isAuthenticated } from "../components/services/authService";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [username, setUsernameState] = useState(getUsername() || "");

  useEffect(() => {
    const updateAuth = () => {
      setAuthenticated(isAuthenticated());
      setUsernameState(getUsername() || "");
    };

    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  return { authenticated, username };
}