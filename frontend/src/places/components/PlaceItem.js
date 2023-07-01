import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';

const PlaceItem = props => {
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const { isLoading, error, sendRequest, errorResetHandler } = useHttpClient();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const showDeleteConfirmHandler = () => {
    setShowDeleteConfirm(true);
  };
  const cancelDeleteConfirmHandler = () => {
    setShowDeleteConfirm(false);
  };
  // the actual deletion of the place
  const confirmDeleteHandler = async () => {
    setShowDeleteConfirm(false); // close the modal
    console.log("deleting place...");

    const placeId = props.id;
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "DELETE",
        null,
        {}
      );
      
      props.onDelete(placeId); // refresh the page (and remove the place)
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorResetHandler} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
        <p>{props.address}</p>
      </Modal>

      <Modal
        show={showDeleteConfirm}
        onCancel={cancelDeleteConfirmHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteConfirmHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that this
          can't be undone.
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay />
            </div>
          )}
          <div className="place-item__image">
            <img src={props.imageUrl} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && props.creatorId === auth.userId && (
              <Button to={`/places/${props.id}`}>EDIT THIS PLACE</Button>
            )}
            {auth.isLoggedIn && props.creatorId === auth.userId && (
              <Button danger onClick={showDeleteConfirmHandler}>
                DELETE THIS PLACE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;