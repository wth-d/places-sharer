import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  // dummy variable
  // const USERS = [
  //   {
  //     id: "u1",
  //     name: "Mark Zuckerburg",
  //     image:
  //       "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  //     places: 3,
  //   },
  // ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(process.env.REACT_APP_Backend_URL + '/api/users');

        const jsonResponse = await response.json();
        console.log("jsonResponse:", jsonResponse);

        if (response.ok) {
          setLoadedUsers(jsonResponse.users);
        } else {
          console.log("Got a non-ok status code.");
          throw new Error(jsonResponse.message);
        }
      } catch (err) {
        setError(
          err.message ||
            "Something went wrong. Could not fetch the list of users. Please refresh the page."
        );
      }
      
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const errorResetHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
      {loadedUsers && <UsersList items={loadedUsers} />}
      {/* !isLoading && loadedUsers && ...  -> <UsersList> component generates an error when loadedUsers is undefined */}
    </React.Fragment>
  );
};

export default Users;
