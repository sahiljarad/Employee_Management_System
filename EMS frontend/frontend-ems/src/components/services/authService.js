// const TOKEN_KEY = "token";
// const USERNAME_KEY = "EMSusername";

// // ---------------- GET ----------------
// export const getToken = () => {
//   return localStorage.getItem(TOKEN_KEY);
// };

// export const getUsername = () => {
//   return localStorage.getItem(USERNAME_KEY);
// };

// // ---------------- AUTH ----------------
// export const isAuthenticated = () => {
//   return !!localStorage.getItem(TOKEN_KEY);
// };

// // ---------------- SET SESSION ----------------
// export const setSession = (token, username) => {
//   localStorage.setItem(TOKEN_KEY, token);
//   localStorage.setItem(USERNAME_KEY, username);

//   window.dispatchEvent(new Event("authChange"));
// };

// // ---------------- CLEAR SESSION ----------------
// export const clearSession = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(USERNAME_KEY);

//   window.dispatchEvent(new Event("authChange"));
// };


const TOKEN_KEY = "token";
const USERNAME_KEY = "EMSusername";

// ---------------- GET TOKEN ----------------

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// ---------------- GET USERNAME ----------------

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

// ---------------- CHECK AUTH ----------------

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// ---------------- SET SESSION ----------------

export const setSession = (token, username) => {

  // Remove old/expired token
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);

  // Save NEW token
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);

  console.log("========== NEW SESSION ==========");
  console.log("Username:", username);
  console.log("New JWT saved:", localStorage.getItem(TOKEN_KEY));

  window.dispatchEvent(new Event("authChange"));
};

// ---------------- CLEAR SESSION ----------------

export const clearSession = () => {

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);

  console.log("========== SESSION CLEARED ==========");

  window.dispatchEvent(new Event("authChange"));
};