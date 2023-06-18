import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  // dummy variable
  const USERS = [
    {
      id: "u1",
      name: "Mark Zuckerburg",
      image:
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
