import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlacesList from '../components/PlacesList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
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
//     visibility: "public",
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
//     visibility: "public",
//   },
// ];

// fetches (from backend) and renders all places of a user
const UserPlaces = () => {
  const userId = useParams().userId; // this user's places will be displayed by this component
  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState(undefined);

  useEffect(() => {
    const fetchPlacesForUser = async () => {
      try {
        const jsonResponse = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        // filter the places array
        // logged in - only keep a place if it (either belongs to current user OR is public)
        // not logged in - only keep a place if it is public
        
        // temporary
        const DUMMY_PLACES = [];
        DUMMY_PLACES.filter((place) => {
          if (auth.isLoggedIn) {
            const currentUid = auth.userId; // different from "useParams().userId" above

            if (place.creator === currentUid) {
              return true;
            } else if (place.visibility === "public") { // doesn't belong to current user, but is public
              return true;
            } else {
              return false;
            }
          } else { // not logged in
            return place.visibility === "public";
          }
        });

        setLoadedPlaces(jsonResponse.places);
      } catch (err) {}
    };

    fetchPlacesForUser();
  }, [sendRequest, userId, auth.isLoggedIn, auth.userId]);
  // sendRequest won't trigger useEffect to re-execute since it's wrapped in useCallback

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => place.id !== deletedPlaceId);
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlacesList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;