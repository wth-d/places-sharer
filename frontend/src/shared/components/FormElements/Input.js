import React, { useEffect, useReducer, useState } from "react";

import { validate } from "../../util/validators"; 
import "./Input.css";

// This component (Input) combines <label> and <input>, and has built-in user input
// validation (with "validators" and "onChange" props);

const inputReducer = (currState, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...currState,
        value: action.val,
        isValid: validate(action.val, action.validators),
        //isTouched: false,
      };
    //break;
    case "TOUCH":
      return {
        ...currState,
        isTouched: true,
      };
    default:
      return currState; // doesn't change the state
    //break;
  }
};

// props.initValue/props.initValid: initial values for value and isValid;
const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialIsValid || false,
    isTouched: false,
  });

  // const [enteredValue, setEnteredValue] = useState('');

  const idProp = props.id;
  const onInputProp = props.onInput;
  useEffect(() => {
    onInputProp(idProp, inputState.value, inputState.isValid);
  }, [idProp, onInputProp, inputState.value, inputState.isValid]);

  const changeHandler = (event) => {
    // whenever the user enters a keystroke,
    // we want to store the value and validate it;
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
    // dispatch -> calls the inputReducer() callback function (to dispatch the CHANGE event)

    if (props.type === "radio") { // && props.element === "input"
      console.log("event.target.value is", event.target.value);

      const toUpdate = (props.id === "visible-choice1") ? "visible-choice2" : "visible-choice1";
      // dispatch() // can't dispatch to the other Input component's inputState
      // onInputProp(toUpdate, "", true); // reset the other choice

      // if (props.value === "public") {
      //   setVisibility("public");
      // } else {
      //   setVisibility("private");
      // }
    }
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  // const [visibility, setVisibility] = useState("public"); // only used for radio input

  let element;
  if (props.element === "input") {
    if (props.type === "radio") {
      // for radio, we do not use inputState (or use useForm hook) -> nope, still use these
      element = (
        <input
          id={props.id}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder} // not used?
          onChange={changeHandler}
          onBlur={touchHandler}
          value={props.value} // fixed?
          checked={props.checked} // {visibility === "public" ? true : false}
        />
      );
    } else {
      element = (
        <input
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
    }
  } else {
    element = (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  }

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

// have dynamic classes on the <div> so that we can e.g. color input&field
// red if input is invalid;

export default Input;
