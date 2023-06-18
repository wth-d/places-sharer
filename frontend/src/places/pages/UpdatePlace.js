import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

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

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  // const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  // const [formState, inputHandler, replaceFormData] = useForm(
  //   {
  //     "place-title2": {
  //       value: identifiedPlace.title,
  //       isValid: true,
  //     },
  //     description2: {
  //       value: identifiedPlace.description,
  //       isValid: true,
  //     },
  //   },
  //   true
  // );

  // before data from backend is fetched
  const [formState, inputHandler, replaceFormData] = useForm(
    {
      "place-title2": {
        value: '',
        isValid: false,
      },
      description2: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  
  let [isLoading, setIsLoading] = useState(true); // temporary

  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      replaceFormData(
        {
          "place-title2": {
            value: identifiedPlace.title,
            isValid: true,
          },
          description2: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [replaceFormData, identifiedPlace]);
  // With every re-render cycle, replaceFormData won't change since it's defined with useCallback; identifiedPlace
  // for now won't change since it's the same object in memory... (may change with a backend added?);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  // temporary
  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading..</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="place-title2"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState["inputs"]["place-title2"]["value"]}
        initialIsValid={formState["inputs"]["place-title2"]["isValid"]}
      />
      <Input
        id="description2"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        //initValue={identifiedPlace.description}
        //initValid={true}
        initialValue={formState["inputs"]["description2"]["value"]}
        initialIsValid={formState["inputs"]["description2"]["isValid"]}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;