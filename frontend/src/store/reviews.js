// frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/loadReviews";

const LOAD_REVIEWS_CURRENT_USER = "reviews/loadReviewsCurrentUser";

// Actions here
const loadReviews = (reviews, spotId) => ({
  type: LOAD_REVIEWS,
  payload: reviews,
  spotId,
});

const loadReviewsCurrentUser = (reviews) => ({
  type: LOAD_REVIEWS_CURRENT_USER,
  payload: reviews,
});

// Future thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const { Reviews } = await response.json();
    dispatch(loadReviews(Reviews, spotId));
  }
};

export const deleteReviewById = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  return response;
};

export const fetchReviewsCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");
  if (response.ok) {
    const { Reviews } = await response.json();
    dispatch(loadReviewsCurrentUser(Reviews));
  }
};

// Reducer
const initialState = { reviews: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.spotId]: action.payload,
        },
      };
    }
    case LOAD_REVIEWS_CURRENT_USER: {
      const currentUserReviews = {};
      action.payload.forEach((review) => {
        currentUserReviews[review.id] = review;
      });
      return {
        ...state,
        reviews: {
          ...state.reviews,
          currentUser: currentUserReviews,
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
