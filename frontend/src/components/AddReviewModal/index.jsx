import { useState } from "react";
import Modal from "../Modal";
import "./AddReviewModal.css";
import { addReviewToSpotById } from "../../store/spots";
import { useDispatch } from "react-redux";

const AddReviewModal = ({ visible, onClose, spotId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const isFormValid = comment.length <= 10 || rating === null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("here");
    dispatch(addReviewToSpotById(spotId, { review: comment, stars: rating }))
      .then(onClose)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  return (
    <Modal
      body={
        <>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="">
                {/* <label htmlFor="comment">Review</label> */}
                <textarea
                  id="comment"
                  rows={8}
                  cols={30}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave your review here...."
                  required
                />
              </div>
              <div className="review_rating">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;

                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        value={currentRating}
                        onChange={() => setRating(currentRating)}
                      />
                      <span
                        className="review_star"
                        style={{
                          color:
                            currentRating <= (hover || rating)
                              ? "#ffc107"
                              : "grey",
                        }}
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                      >
                        &#9733;
                      </span>
                    </label>
                  );
                })}
              </div>
            </form>
          </div>
        </>
      }
      visible={visible}
      onClose={onClose}
      header="How was your stay?"
      primaryBtnTitle={"Submit Your Review"}
      primaryBtnDisabled={isFormValid}
      primaryBtnFunction={handleSubmit}
    />
  );
};

export default AddReviewModal;
