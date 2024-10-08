import React, { useState, useContext } from 'react';

import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../../shared/util/validators";
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './Auth.css';
// import '../../places/pages/PlaceForm.css'; // 'place-form' class on <form>

const Auth = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();

  const [formState, inputHandler, replaceFormData] = useForm(
    {
      "user-email": {
        value: "",
        isValid: false,
      },
      "password": {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    if (isLoginMode) {
      try {
        const jsonResponse = await sendRequest( // url, method, body, headers
          process.env.REACT_APP_Backend_URL + "/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs["user-email"].value,
            password: formState.inputs["password"].value,
          }),
          {
            "Content-type": "application/json", // so that bodyParser.json() can parse it correctly
          }
        );

        auth.login(jsonResponse["user logged in"].id, jsonResponse.token);
      } catch (err) {
        // console.log("An error occured in sendRequest."); // errors should have been checked in http-hook.js
      }
      
    } else { // sign up
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs["user-name"].value);
        formData.append("email", formState.inputs["user-email"].value);
        formData.append("password", formState.inputs["password"].value);
        formData.append("image", formState.inputs["image"].value);
        // key (1st argument) is "image" -> used by multer in backend

        await sendRequest(
          process.env.REACT_APP_Backend_URL + "/api/users/signup",
          "POST",
          formData
          // { // headers should be set automatically
          //   "Content-type": "application/json",
          // }
        );

        // no error, so display success message/banner
        setSignupSuccess(true); // maybe set it to false swh else?
        // auth.login(); // could log in here
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // switching to login mode
      replaceFormData(
        {
          ...formState.inputs,
          "user-name": undefined,
          image: undefined
          // "user-email": {
          //   ...formState["user-email"]
          // },
          // password: {
          //   ...formState["password"]
          // }
        },
        formState["inputs"]["user-email"]["isValid"] &&
          formState["inputs"]["password"]["isValid"]
      );
    } else {
      // switching to signup mode
      replaceFormData(
        {
          ...formState.inputs,
          "user-name": {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }

    setIsLoginMode((prevMode) => {
      return !prevMode;
    });
    setSignupSuccess(false); // remove the message
    errorResetHandler(); // unneeded
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Login Required" : "Signup"}</h2>
        <hr />
        <form onSubmit={loginSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="user-name"
              element="input" //or textarea
              type="text"
              label="Your Name" // what's displayed
              validators={[VALIDATOR_MINLENGTH(3)]}
              errorText="Please enter a valid name (at least 3 characters)."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            id="user-email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input" //or textarea
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password (at least 5 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOG IN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
        {signupSuccess && !isLoginMode && (
          <React.Fragment>
            <div>
              <br />
              Sign up succeeded! Please log in now.
            </div>
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Auth;
