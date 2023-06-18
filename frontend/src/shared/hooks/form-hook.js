import { useCallback, useReducer } from "react";

const formReducer = (currState, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in currState.inputs) {
        if (currState['inputs'][inputId] === undefined) {
          // to handle an inputId whose value is undefined (without an object literal)
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && currState['inputs'][inputId]['isValid'];
        }
      }
      return {
        ...currState,
        inputs: {
          ...currState.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
      // break;
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return currState;
  }
};

// @param {!Object} initialInputs - initial values for inputs, serving as parameters to be passed into useReducer()
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity, // validity of entire form
  });

  // validity of the entire form and all input values
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  // not needed
  //const descriptionInputHandler = useCallback((id, value, isValid) => {}, []);

  // purpose of this function: in UpdatePlace.js, identifiedPlace can take some time to be fetched from backend, so
  //    after it's successfully fetched this formState needs to be updated;
  // Technically, could also just invoke inputHandler() twice to update formState.
  const replaceFormData = useCallback((inputsData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputsData,
      formIsValid: formValidity
    });
  }, []);

  return [formState, inputHandler, replaceFormData];
};
