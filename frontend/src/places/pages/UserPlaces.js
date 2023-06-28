import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlacesList from '../components/PlacesList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [
//   {
//     id: "p2",
//     title: "Robarts Library #2",
//     description: "The largest library in Canada - for p2.",
//     image: // was imageUrl
//       "https://lh3.googleusercontent.com/p/AF1QipPogTV20XRMlrjVPtlyOG5p9oeYcziXBYo_WEBf=s1360-w1360-h1020",
//     address: "130 St George St, Toronto, ON, M5S 1A5",
//     location: {
//       lat: 43.6645012,
//       lng: -79.4084233,
//     },
//     creator: "u2",
//   },
//   {
//     id: "p1",
//     title: "Robarts Library",
//     description: "The largest library in Canada.",
//     image:
//       "https://onesearch.library.utoronto.ca/sites/default/public/styles/max_650x650/public/libraryphotos/robarts-library_0.jpg?itok=Ud4zhDLg",
//     address: "130 St George St, Toronto, ON, M5S 1A5",
//     location: {
//       lat: 43.6645012,
//       lng: -79.4084233,
//     },
//     creator: "u1",
//   },
// ];

// fetches (from backend) and renders all places of a user
const UserPlaces = () => {
  const userId = useParams().userId;
  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlacesForUser = async () => {
      try {
        const jsonResponse = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        setLoadedPlaces(jsonResponse.places);
      } catch (err) {}
    };

    fetchPlacesForUser();
  }, [sendRequest, userId]);
  // sendRequest won't trigger useEffect to re-execute since it's wrapped in useCallback

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {loadedPlaces && <PlacesList items={loadedPlaces} />}
    </React.Fragment>
  );
};

export default UserPlaces;