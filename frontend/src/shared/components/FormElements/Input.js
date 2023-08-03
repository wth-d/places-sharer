import React, { useEffect, useReducer } from "react";

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
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  let element;
  if (props.element === "input") {
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
