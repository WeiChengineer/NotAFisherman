import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots, getSpotsCurrentUser } from '../../store/spots';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DeleteModal from '../DeleteModal';
import './LandingPage.css';
import Card from '../Card';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUpdateClick = (spotId) => {
    navigate(`/my-spot/${spotId}`);
  };

  const isMySpotsRoute = location.pathname.endsWith('/my-spots');

  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
  };

  useEffect(() => {
    if (isMySpotsRoute) {
      dispatch(getSpotsCurrentUser());
    } else {
      dispatch(getSpots());
    }
  }, [dispatch, isMySpotsRoute]);

  return (
    <div className="home__section">
      {isMySpotsRoute && (
        <h1>Manage Spots</h1>
      )}
      {spots.length > 0 ? (
        spots.map((spot) => (
          <div key={spot.id} className="spot-tile-link">
            <Card
              id={spot.id}
              src={spot.previewImage || "https://a2.muscache.com/im/pictures/6152848/b04eddeb_original.jpg?aki_policy=x_medium"}
              title={spot.name}
              description={`${spot.city}, ${spot.state}`}
              price={parseFloat(spot.price).toFixed(2)}
              rating={parseFloat(spot.avgRating).toFixed(2) !== 'NaN' ? parseFloat(spot.avgRating).toFixed(2) : 'New'}
            />
            {isMySpotsRoute && (
              <div className="spot-actions">
                <button className="update_spot_btn" onClick={() => handleUpdateClick(spot.id)}>
                  Update
                </button>
                <button
                  className="delete_spot_btn"
                  onClick={() => {
                    setSelectedSpotId(spot.id);
                    toggleDeleteModal();
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="create-spot-link">
          <Link to="/my-spot">Create a New Spot</Link>
        </div>
      )}
      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          onClose={toggleDeleteModal}
          itemName="spot"
          itemId={selectedSpotId}
        />
      )}
    </div>
  );
};

export default LandingPage;