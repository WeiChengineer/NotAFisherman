import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";
import { FaStar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./SpotDetail.css";
import AddReviewModal from "../AddReviewModal";
import DeleteModal from "../DeleteModal";

const staticPreviewImage = "gofindapicture.jpg";
const staticOtherImages = [
  "../../assets/images/china1.jpeg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
];

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotDetails[spotId]);
  const reviews = useSelector((state) => state.reviews.reviews[spotId] || []);
  const currentUser = useSelector((state) => state.session.user);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(fetchReviews(spotId)))
      .finally(() => setIsLoaded(true));
  }, [dispatch, spotId, showDeleteModal, showAddReviewModal]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? reviews.reduce((acc, cur) => acc + cur.stars, 0) / reviewCount : "New";
  const hasAlreadyReviewed = reviews.some(review => review.userId === currentUser.id);

  return (
    <div className="spotContainer">
      <div className="spotWrapper">
        <h1 className="spotTitle">{spot.name}</h1>
        <div className="spotAddress">
          <FontAwesomeIcon icon={faLocationDot} />
          <span> {spot.city}, {spot.state}, {spot.country}</span>
        </div>

        <div className="grid-container">
          <div className="spotCard spotCard--2x">
            <img src={staticPreviewImage} alt="Spot Preview" />
          </div>
          {staticOtherImages.map((url, index) => (
            <div className="spotCard" key={index}>
              <img src={url} alt={`Spot Detail ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Spot details and review section remains unchanged */}
      </div>

      {/* Modals */}
      {showAddReviewModal && <AddReviewModal onClose={() => setShowAddReviewModal(false)} />}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} reviewId={reviewId} />}
    </div>
  );
};

export default SpotDetail;
