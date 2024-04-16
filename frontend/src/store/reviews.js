import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/loadReviews';
const LOAD_REVIEWS_CURRENT_USER = 'reviews/loadReviewsCurrentUser';
const REVIEW_DELETED = 'reviews/reviewDeleted'; 

// Action creators
const loadReviews = (reviews, spotId) => ({
  type: LOAD_REVIEWS,
  payload: reviews,
  spotId,
});

const loadReviewsCurrentUser = (reviews) => ({
  type: LOAD_REVIEWS_CURRENT_USER,
  payload: reviews,
});

const reviewDeleted = (reviewId) => ({
  type: REVIEW_DELETED,
  reviewId,
});

// Thunk actions
export const fetchReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const { Reviews } = await response.json();
      dispatch(loadReviews(Reviews, spotId));
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};

export const deleteReviewById = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (response.ok) {
      dispatch(reviewDeleted(reviewId)); 
    }
  } catch (error) {
    console.error("Failed to delete review:", error);
  }
};

export const fetchReviewsCurrentUser = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/reviews/current');
    if (response.ok) {
      const { Reviews } = await response.json();
      dispatch(loadReviewsCurrentUser(Reviews));
    }
  } catch (error) {
    console.error("Failed to fetch current user's reviews:", error);
  }
};

// Reducer
const initialState = { reviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      return {
        ...state,
        reviews: { ...state.reviews, [action.spotId]: action.payload },
      };
    }
    case LOAD_REVIEWS_CURRENT_USER: {
      const currentUserReviews = Object.fromEntries(action.payload.map((review) => [review.id, review]));
      return {
        ...state,
        reviews: { ...state.reviews, currentUser: currentUserReviews },
      };
    }
    case REVIEW_DELETED: {
      const newState = { ...state };
      Object.keys(newState.reviews).forEach((spotId) => {
        if (newState.reviews[spotId][action.reviewId]) {
          delete newState.reviews[spotId][action.reviewId];
        }
      });
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
