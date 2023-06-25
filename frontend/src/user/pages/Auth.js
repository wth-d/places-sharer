import React, { useState, useContext } from 'react';

import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../../shared/util/validators";
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './Auth.css';
// import '../../places/pages/PlaceForm.css'; // 'place-form' class on <form>

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined); // "undefined" could be omitted
  const [signupSuccess, setSignupSuccess] = useState(false);

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

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    if (isLoginMode) {
      auth.login(); // or could log in for both signup and login modes
    } else {
      try {
        setIsLoading(true); // re-render the page
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json', // so that bodyParser.json() can parse it correctly
          },
          body: JSON.stringify({
            name: formState.inputs['user-name'].value,
            email: formState.inputs['user-email'].value,
            password: formState.inputs['password'].value
          })
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          // no error, so display success message/banner
          setSignupSuccess(true); // maybe set it to false swh else?

        } else {
          console.log("Got a non-ok status code.");
          const jsonResponse = await response.json();
          console.log(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setError(error.message || "Something went wrong. Please try again.");
      }
      setIsLoading(false); // stops the loading for both success&error
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // switching to login mode
      replaceFormData(
        {
          ...formState.inputs,
          "user-name": undefined
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
        },
        false
      );
    }

    setIsLoginMode((prevMode) => {
      return !prevMode;
    });
    setSignupSuccess(false); // remove the message
    setError(undefined);
  };

  return (
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
    </Card>
  );
};

export default Auth;
