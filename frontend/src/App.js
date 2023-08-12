import React, { useState, useCallback } from 'react';
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

  const login = useCallback((uid, tokenParam) => {
    setToken(tokenParam);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

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
