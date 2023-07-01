import React, { useRef, useState } from "react";

import "./Button";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  const updatePreviewUrl = (imgFile) => { // could use useEffect
    if (!imgFile) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(imgFile);
  };

  const pickedHandler = (event) => {
    // console.log(event.target); // the input component
    console.log(event.target.files); // the files selected

    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true); // doesn't update "isValid" immediately here
      fileIsValid = true;
      updatePreviewUrl(pickedFile);
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click(); // clicks the <input> picker
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }} // this file-picker is hidden
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler} // triggered after user has picked a file
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image (max 500KB).</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {/* type="button" -> won't accidentally submit a form that's around the button */}
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
