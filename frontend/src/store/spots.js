// frontend/src/store/spots.js

import { csrfFetch } from "./csrf";
import { addReview } from "./reviews";


// Action Types
const ActionTypes = {
  LOAD_SPOTS: "spots/loadSpots",
  LOAD_SPOT_DETAILS: "spots/loadSpotDetails",
  LOAD_SPOTS_CURRENT_USER: "spots/loadSpotsCurrentUser",
  CREATE_SPOT: "spots/createSpot",
  ADD_IMAGE_TO_SPOT: "spots/addImageToSpot",
  REMOVE_SPOT: "spots/removeSpot",
};

// Action Creators
const actionCreators = {
  loadSpots: (spots) => ({ type: ActionTypes.LOAD_SPOTS, payload: spots }),
  loadSpotDetails: (spotDetails) => ({ type: ActionTypes.LOAD_SPOT_DETAILS, payload: spotDetails }),
  loadSpotsCurrentUser: (spots) => ({ type: ActionTypes.LOAD_SPOTS_CURRENT_USER, payload: spots }),
  createSpot: (spot) => ({ type: ActionTypes.CREATE_SPOT, payload: spot }),
  addImageToSpot: (image, spotId) => ({ type: ActionTypes.ADD_IMAGE_TO_SPOT, payload: { image, spotId } }),
  removeSpot: (spotId) => ({ type: ActionTypes.REMOVE_SPOT, payload: spotId}),
};



// Thunks
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(actionCreators.loadSpots(Spots));
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(actionCreators.loadSpotDetails(spotDetails));
  }
};

export const getSpotsCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(actionCreators.loadSpotsCurrentUser(Spots));
  }
};

export const createNewSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(actionCreators.createSpot(newSpot));
    return newSpot;
  }
};

export const updateSpot = (spotData, spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotData),
  });
};

export const addImageToSpotById = (spotId, imageUrl, isPreview) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, preview: isPreview }),
  });

  if (response.ok) {
    const newImage = await response.json();
    dispatch(actionCreators.addImageToSpot(newImage, spotId));
    return newImage;
  }
};

export const addReviewToSpotById = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview, spotId));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
};



export const deleteSpotById = (spotId) => async (dispatch) => {
  try {
      const response = await csrfFetch(`/api/spots/${spotId}`, { method: "DELETE" });
      if (response.ok) {
          dispatch(actionCreators.removeSpot(spotId));
      } else {
          throw new Error('Failed to delete the spot');
      }
  } catch (error) {
      console.error('Delete operation failed:', error);
      throw error; 
  }
};



// Reducer
const initialState = { allSpots: {}, spotDetails: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_SPOTS: {
      const newSpots = Object.fromEntries(action.payload.map((spot) => [spot.id, spot]));
      return { ...state, allSpots: newSpots };
    }
    case ActionTypes.LOAD_SPOT_DETAILS: {
      const newSpotDetails = { ...state.spotDetails, [action.payload.id]: action.payload };
      return { ...state, spotDetails: newSpotDetails };
    }
    case ActionTypes.LOAD_SPOTS_CURRENT_USER: {
      const currentUserSpots = Object.fromEntries(action.payload.map((spot) => [spot.id, spot]));
      return { ...state, allSpots: currentUserSpots };
    }
    case ActionTypes.CREATE_SPOT: {
      const updatedSpots = { ...state.allSpots, [action.payload.id]: action.payload };
      return { ...state, allSpots: updatedSpots };
    }
    case ActionTypes.ADD_IMAGE_TO_SPOT: {
      const newState = { ...state, spotDetails: { ...state.spotDetails } };
      const { image, spotId } = action.payload;
      const spotImages = newState.spotDetails[spotId]?.SpotImages || [];
      newState.spotDetails[spotId] = { ...newState.spotDetails[spotId], SpotImages: [...spotImages, image] };
      return newState;
    }
    case ActionTypes.REMOVE_SPOT: {
      const spotId = action.payload;
      const newSpots = { ...state.allSpots};
      delete newSpots[spotId];
      return { ...state, allSpots: newSpots};
    }
   
    default:
      return state;
  }
};


export default spotsReducer;
