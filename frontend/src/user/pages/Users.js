import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

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
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/users');

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
    sendRequest();
  }, []);

  const errorResetHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
      <UsersList items={loadedUsers} /> {/* !isLoading && loadedUsers && ... */}
    </React.Fragment>
  );
};

export default Users;
