import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children} {/* input/content of the form */}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer} {/* buttons of the form */}
        </footer>
      </form>
    </div>
  );
  // in the form, if props.onSubmit is set, then set onSubmit to props.onSubmit;
  // otherwise, set it to an arrow function; this arrow function ensures that
  // when the user clicks a button in the form, a page reload (the default) won't happen;

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = props => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
