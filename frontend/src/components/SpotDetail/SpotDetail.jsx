import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./SpotDetail.css";
import { getSpotDetails } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";
import { FaStar } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import AddReviewModal from "../AddReviewModal";
import DeleteModal from "../DeleteModal";

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
    const fetchDetails = async () => {
      await dispatch(getSpotDetails(spotId));
      await dispatch(fetchReviews(spotId));
      setIsLoaded(true);
    };
    fetchDetails();
  }, [dispatch, spotId]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  // Image
  const defaultImage = "https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg";
  const previewImage = spot.SpotImages?.find((image) => image.preview)?.url || defaultImage;
  const otherImages = spot.SpotImages?.filter((image) => !image.preview).map((image) => image.url) || [];
  while (otherImages.length < 4) {
    otherImages.push(defaultImage);
  }

  // Review
  const reviewCount = reviews.length;
  const sumRating = reviews.reduce((prev, curr) => prev + curr.stars, 0);
  const avgRatingDisplay = reviewCount ? (sumRating / reviewCount).toFixed(2) : "New";

  const hasAlreadyReviewed = reviews.some(review => review.userId === currentUser?.id);
  const beFirstPostReviewMessage = reviewCount === 0 && currentUser && currentUser.id !== spot.ownerId;

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
            <div className="card__image">
              <img src={previewImage} alt="Spot preview" />
            </div>
          </div>
          {otherImages.slice(0, 4).map((url, index) => (
            <div className="spotCard" key={index}>
              <div className="card__image">
                <img src={url} alt={`Spot image ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="spotDetails">
          <div className="spotDetailsTexts">
            <h1 className="spotTitle">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>
            <p className="spotDesc">{spot.description}</p>
          </div>
          <div className="spotDetailsPrice">
            <div className="row justify-between items-center w-full">
              <h4 className="w-full">${parseFloat(spot.price).toFixed(2)} night</h4>
              <p className="row items-center justify-end">
                <span><FaStar /> {avgRatingDisplay}</span>
                {reviewCount > 0 ? ` · ${reviewCount} Review${reviewCount > 1 ? "s" : ""}` : ""}
              </p>
            </div>
            <button className="w-full spotDetailsbtn" onClick={handleReserveClick}>Reserve</button>
          </div>
        </div>
        <hr />
      <section className="reviews">
  <p className="row items-center avg-reviews">
    <FaStar /> {avgRatingDisplay}
    {reviewCount > 0 ? ` · ${reviewCount} Review${reviewCount > 1 ? "s" : ""}` : ""}
  </p>
  {currentUser && currentUser.id !== spot.ownerId && !hasAlreadyReviewed && (
    <button className="spotDetailsbtn" onClick={() => setShowAddReviewModal(true)}>Post Your Review</button>
  )}
  {beFirstPostReviewMessage ? (
    <p>Be the first to post a review!</p>
  ) : (
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
      <div key={review.id} className="review">
        <div className="user-name">{review.User.firstName}</div>
        <div className="review-date"> {new Date(review.createdAt).toLocaleDateString("en-US")}</div>
        <p className="comment-text">{review.review}</p>
        {currentUser && currentUser.id === review.userId && (
          <button className="spotDetailsbtn" onClick={() => {
            setReviewId(review.id);
            setShowDeleteModal(true);
          }}>Delete</button>
        )}
      </div>
    ))
  )}
</section>

      </div>
      {showAddReviewModal && (
        <AddReviewModal
          spotId={spotId}
          visible={showAddReviewModal}
          onClose={() => setShowAddReviewModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          itemName="review"
          itemId={reviewId}
        />
      )}
    </div>
  );
};

export default SpotDetail;
