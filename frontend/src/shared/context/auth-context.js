import { createContext } from "react";

// an object to be shared among components
export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
