import React from 'react';
import { useParams } from 'react-router-dom';

import PlacesList from '../components/PlacesList';
import { useHttpClient } from '../../shared/hooks/http-hook';

const DUMMY_PLACES = [
  {
    id: "p2",
    title: "Robarts Library #2",
    description: "The largest library in Canada - for p2.",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPogTV20XRMlrjVPtlyOG5p9oeYcziXBYo_WEBf=s1360-w1360-h1020",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u2",
  },
  {
    id: "p1",
    title: "Robarts Library",
    description: "The largest library in Canada.",
    imageUrl:
      "https://onesearch.library.utoronto.ca/sites/default/public/styles/max_650x650/public/libraryphotos/robarts-library_0.jpg?itok=Ud4zhDLg",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u1",
  },
];

// fetches (from backend) and renders all places of a user
const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  return <PlacesList items={loadedPlaces} />
};

export default UserPlaces;