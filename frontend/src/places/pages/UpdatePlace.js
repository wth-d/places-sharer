import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../../shared/context/auth-context';
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
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const findPlace = async () => {
      try {
        const jsonResponse = await sendRequest(`${process.env.REACT_APP_Backend_URL}/api/places/${placeId}`);

        setIdentifiedPlace(jsonResponse.place);
        setVisibility(
          jsonResponse.place.isprivate === true ? "private" : "public"
        );
      } catch (err) {
        setIdentifiedPlace(null);
        setVisibility(null);
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
    console.log("before submit: visibility is", visibility);

    try {
      // if visibility sent is not 'public' or 'private' (e.g. null), the backend shouldn't update it;
      await sendRequest(
        `${process.env.REACT_APP_Backend_URL}/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState["inputs"]["place-title2"]["value"],
          description: formState["inputs"]["description2"]["value"],
          isprivate:
            visibility === "private"
              ? true
              : visibility === "public"
              ? false
              : null,
        }),
        {
          "Content-type": "application/json",
          Authorization: "Bearer " + auth.token
        }
      );

      history.push(`/${identifiedPlace.creator}/places`);
    } catch (err) {}
  };

  // initial value of "visibility" is to be fetched by backend, and will be null if backend fails to fetch it
  const [visibility, setVisibility] = useState(undefined);
  const selectChangeHandler = (event) => {
    // executed whenever the user selects a different visibility;
    console.log("event.target.value is", event.target.value);

    setVisibility(event.target.value);
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

          <fieldset>
            <p>Visibility: {!!visibility && `(currently ${visibility})`}</p>
            {/* <Button type="button" disabled={false} onClick={}>{visibility}</Button> */}
            <div>
              <input
                type="radio"
                id="visible-choice1"
                element="input"
                name="visibility"
                value="public"
                // checked // cannot use
                onChange={selectChangeHandler}
              />
              <label htmlFor="visible-choice1">Public&ensp;</label>

              <input
                type="radio"
                id="visible-choice2"
                element="input"
                name="visibility"
                value="private"
                // checked={false}
                onChange={selectChangeHandler}
              />
              <label htmlFor="visible-choice2">Private</label>
            </div>
          </fieldset>

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;