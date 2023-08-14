import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from "../../shared/components/FormElements/Input";
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import "./PlaceForm.css";

const NewPlace = () => {
  const [formState, inputHandler] = useForm(
    {
      "place-title": {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: { // the key in useForm has to match the id of the corresponding <Input>/<ImageUpload> component in the JSX below
        value: null,
        isValid: false
      }
    },
    false
  );

  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();
  const auth = useContext(AuthContext);

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend
    console.log("visibility:", visibility);

    const isprivate =
      (visibility === "private") ? true : (visibility === "public") ? false : null;

    const formData = new FormData();
    formData.append("title", formState.inputs["place-title"].value);
    formData.append("description", formState.inputs["description"].value);
    formData.append("address", formState.inputs["address"].value);
    formData.append("isprivate", isprivate);
    formData.append("creator", auth.userId); // cannot be other users' id;
    formData.append("image", formState.inputs["image"].value);
    try {
      await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token
        }
      );

      // redirect the user to a different page (home page)
      history.push('/');
    } catch (err) {}
  };

  const [visibility, setVisibility] = useState("public"); // public by default

  const selectChangeHandler = (event) => {
    // executed whenever the user selects a different visibility;

    console.log("event.target.value is", event.target.value);    
    
    setVisibility(event.target.value);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Input
          id="place-title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />

        <fieldset>
          <p>Visibility: (public by default)</p>
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
              //required // public by default, so not needed
            />
            <label htmlFor="visible-choice1">Public</label>
            <span>&ensp;</span>

            <input
              type="radio"
              id="visible-choice2"
              element="input"
              name="visibility"
              value="private"
              // checked={false}
              onChange={selectChangeHandler}
              //required
            />
            <label htmlFor="visible-choice2">Private</label>
          </div>
        </fieldset>

        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
