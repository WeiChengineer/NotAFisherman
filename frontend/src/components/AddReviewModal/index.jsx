import { useState } from 'react';
import Modal from '../Modal';
import './AddReviewModal.css';
import { addReviewToSpotById } from '../../store/spots';
import { useDispatch } from 'react-redux';

const AddReviewModal = ({ visible, onClose, spotId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [errors, setErrors] = useState({});

  const isFormValid = comment.length > 9 && rating !== null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      dispatch(addReviewToSpotById(spotId, { review: comment, stars: rating }))
        .then(() => {
          onClose(); 
          setComment('');  
          setRating(null); 
        })
        .catch((error) => {      
          console.error('Error posting review:', error);
          setErrors({ submit: error.message });
        });
    }
  };
  

  return (
    <Modal
      body={
        <div className="form-container">
          <h3>How was your stay?</h3> {}
          {Object.keys(errors).length > 0 && ( 
            <div className="error-messages">
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <textarea
              id="comment"
              rows={8}
              cols={30}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your review here..."
              required
            />
            <div className="review_rating">
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={currentRating}
                      onClick={() => setRating(currentRating)}
                    />
                    <span
                      className="review_star"
                      style={{ color: currentRating <= (hover || rating) ? '#ffc107' : 'grey' }}
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                    >
                      &#9733;
                    </span>
                  </label>
                );
              })}
              <label className="stars-label">Stars</label>
            </div>
          </form>
        </div>
      }
      visible={visible}
      onClose={onClose}
      header="" 
      primaryBtnTitle="Submit Your Review"
      primaryBtnDisabled={!isFormValid}
      primaryBtnFunction={handleSubmit}
    />
  );
};

export default AddReviewModal;
