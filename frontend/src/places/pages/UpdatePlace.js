import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceForm.css';

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
  
  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const history = useHistory();

  useEffect(() => {
    const findPlace = async () => {
      try {
        const jsonResponse = await sendRequest(`http://localhost:5000/api/places/${placeId}`);

        setIdentifiedPlace(jsonResponse.place);
      } catch (err) {
        setIdentifiedPlace(null);
      }
    };

    findPlace();
  }, [sendRequest, placeId]);

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
    // setIsLoading(false);
  }, [replaceFormData, identifiedPlace]);
  // With every re-render cycle, replaceFormData won't change since it's defined with useCallback; identifiedPlace
  // for now won't change since it's the same object in memory... (may change with a backend added?);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState["inputs"]["place-title2"]["value"],
          description: formState["inputs"]["description2"]["value"],
        }),
        {
          "Content-type": "application/json",
        }
      );

      history.push(`/${identifiedPlace.creator}/places`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!identifiedPlace && !error) { // !identifiedPlace
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="place-title2"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={identifiedPlace.title} // formState["inputs"]["place-title2"]["value"]
            initialIsValid={true} // ["isValid"]
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
            initialValue={identifiedPlace.description} // formState["inputs"]["description2"]["value"]
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;