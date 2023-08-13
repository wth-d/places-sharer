import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import Auth from './user/pages/Auth';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  const [token, setToken] = useState(undefined); // previously isLoggedIn
  const [userId, setUserId] = useState();

  const login = useCallback((uid, tokenParam, expirationTime) => {
    setToken(tokenParam);
    setUserId(uid);
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
      storedData.userId &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }

    //if (storedData && new Date(storedData.expiration) < new Date()) {}
  }, [login]); // this useEffect only runs after the app starts for the first time

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};
// MainNavigation is always visible, no matter which page you're on;

export default App;






// old routes setup:
      // (<Router>
      //   <MainNavigation />
      //   <main>
      //     <Switch>
      //       <Route path="/" exact>
      //         <Users />
      //       </Route>
      //       <Route path="/auth" exact>
      //         <Auth />
      //       </Route>
      //       <Route path="/:userId/places" exact>
      //         <UserPlaces />
      //       </Route>
      //       <Route path="/places/new" exact>
      //         <NewPlace />
      //       </Route>
      //       <Route path="/places/:placeId">
      //         <UpdatePlace />
      //       </Route>
      //       <Redirect to="/" />
      //     </Switch>
      //   </main>
      // </Router>)
