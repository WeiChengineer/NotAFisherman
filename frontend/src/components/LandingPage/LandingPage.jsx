import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots, getSpotsCurrentUser } from '../../store/spots';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { deleteSpotById } from "../../store/spots";
import DeleteModal from '../DeleteModal';
import './LandingPage.css';
import Card from '../Card';

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.allSpots));
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const isMySpotsRoute = location.pathname.endsWith('/my-spots');

    const toggleDeleteModal = () => {
        setShowDeleteModal(prev => !prev);
    };

    const handleDeleteConfirmed = () => {
        dispatch(deleteSpotById(selectedSpotId)).then(() => {
            refreshSpots();
            toggleDeleteModal();
        }).catch(error => {
            console.error('Failed to delete spot:', error);
        });
    };

    const refreshSpots = useCallback(() => {
        if (isMySpotsRoute) {
            dispatch(getSpotsCurrentUser());
        } else {
            dispatch(getSpots());
        }
    }, [dispatch, isMySpotsRoute]);
    
    useEffect(() => {
        refreshSpots();
    }, [refreshSpots]);
    

    const openDeleteModal = (spotId) => {
        setSelectedSpotId(spotId);
        setShowDeleteModal(true);
    };

    return (
        <div className="home__section">
            {isMySpotsRoute && <h1>Manage Spots</h1>}
            {spots.length > 0 ? (
                spots.map(spot => (
                    <div key={spot.id} className="spot-tile-link">
                        <Card
                            id={spot.id}
                            src={spot.previewImage}
                            title={spot.name}
                            description={`${spot.city}, ${spot.state}`}
                            price={parseFloat(spot.price).toFixed(2)}
                            rating={parseFloat(spot.avgRating).toFixed(2) !== 'NaN' ? parseFloat(spot.avgRating).toFixed(2) : 'New'}
                        />
                        {isMySpotsRoute && (
                            <div className="spot-actions">
                                <button className="update_spot_btn" onClick={() => navigate(`/my-spot/${spot.id}`)}>Update</button>
                                <button className="delete_spot_btn" onClick={() => openDeleteModal(spot.id)}>Delete</button>
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
                    onDeleted={handleDeleteConfirmed}
                />
            )}
        </div>
    );
};

export default LandingPage;
