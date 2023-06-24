import React, { useState, useContext } from 'react';

import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../../shared/util/validators";
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);

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
        } else {
          console.log("Got a non-ok status code.");
        }
      } catch (error) {
        console.log(error);
      }
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
  };

  return (
    <Card className="authentication">
      <h2>{isLoginMode ? "Login Required" : "Signup"}</h2>
      <hr />
      <form className="place-form" onSubmit={loginSubmitHandler}>
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
