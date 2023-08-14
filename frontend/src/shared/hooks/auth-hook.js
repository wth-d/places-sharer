import { useState, useCallback, useEffect } from 'react';

let logoutTimer = 100;

export const useAuth = () => {
  const [token, setToken] = useState(undefined); // previously isLoggedIn
  const [userId, setUserId] = useState();

  const login = useCallback((uid, tokenParam, expirationTime) => {
    const tokenExpirationTime =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
      // if a truthy expirationTime argument is provided, then use it; otherwise create a new expirationTime;
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: tokenParam,
        expiration: tokenExpirationTime.toISOString(),
      })
    );
    setToken(tokenParam);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }

    //if (storedData && new Date(storedData.expiration) < new Date()) { log out }
  }, [login]); // this useEffect only runs after the app starts for the first time

  // timer
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (token && storedData) { // executed when logging in
      const remainingTime = new Date(storedData.expiration).getTime() - new Date().getTime();
      //if (remainingTime < 0) logout();
      logoutTimer = setTimeout(logout, remainingTime);
    } else { // executed when logging out
      clearTimeout(logoutTimer);
    }
  }, [token, logout]); // reruns when token changes (i.e. login or logout is called); (logout() won't change;)

  return { token, userId, login, logout };
};