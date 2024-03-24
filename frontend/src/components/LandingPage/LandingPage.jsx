// frontend/src/components/LandingPage/LandingPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots, getSpotsCurrentUser } from "../../store/spots";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";
import "./LandingPage.css";
import Card from "../Card";

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotId, setSpotId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUpdateClick = (e, spotId) => {
    e.stopPropagation();
    navigate(`/my-spot/${spotId}`);
  };

  const isMySpotsRoute = location.pathname.endsWith("/my-spots");

  const updateShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  useEffect(() => {
    if (isMySpotsRoute) {
      dispatch(getSpotsCurrentUser());
      return;
    }
    if (!showDeleteModal) {
      dispatch(getSpots());
    }
  }, [dispatch, isMySpotsRoute, showDeleteModal]);

  return (
    // <div className="spot-container">
    <div className="home__section">
      {spots.map((spot) => (
        <div key={spot.id}>
          {console.log({ spot })}
          <Card
            id={spot.id}
            src={
              spot.previewImage
                ? spot.previewImage
                : "https://a2.muscache.com/im/pictures/6152848/b04eddeb_original.jpg?aki_policy=x_medium"
            }
            title={spot.name}
            description={` ${spot.city} ${spot.state}`}
            price={parseFloat(spot.price).toFixed(2)}
            rating={
              parseFloat(spot.avgRating).toFixed(2) !== "NaN"
                ? parseFloat(spot.avgRating).toFixed(2)
                : "New"
            }
          />
          {isMySpotsRoute ? (
            <div className="row">
              <button
                className="update_spot_btn"
                onClick={(e) => handleUpdateClick(e, spot.id)}
              >
                update
              </button>
              <button
                className="delete_spot_btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSpotId(spot.id);
                  updateShowDeleteModal();
                }}
              >
                delete
              </button>
            </div>
          ) : null}
        </div>
      ))}

      {showDeleteModal ? (
        <DeleteModal
          visible={showDeleteModal}
          onClose={updateShowDeleteModal}
          itemName={"spot"}
          itemId={spotId}
        />
      ) : null}
    </div>
  );
};

export default LandingPage;
