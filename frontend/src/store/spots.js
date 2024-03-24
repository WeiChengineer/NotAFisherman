// frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
const LOAD_SPOTS_CURRENT_USER = "spots/loadSpotsCurrentUser";
const CREATE_SPOT = "spots/createSpot";
const ADD_IMAGE_TO_SPOT = "spots/addImageToSpot";

// Actions here
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

const loadSpotDetails = (spotDetails) => ({
  type: LOAD_SPOT_DETAILS,
  payload: spotDetails,
});

const loadSpotsCurrentUser = (spots) => ({
  type: LOAD_SPOTS_CURRENT_USER,
  payload: spots,
});

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  payload: spot,
});

const addImageToSpot = (image, spotId) => ({
  type: ADD_IMAGE_TO_SPOT,
  payload: { image, spotId },
});

// Future thunks
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(loadSpots(Spots));
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spotDetails = await response.json();
    //
    console.log("LOOK HEREEEEE", spotDetails);
    dispatch(loadSpotDetails(spotDetails));
  }
};

export const getSpotsCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(loadSpotsCurrentUser(Spots));
  }
};

export const createNewSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    return newSpot;
  }
};

export const updateSpot = (spotData, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    // const newSpot = await response.json();
    // dispatch(createSpot(newSpot));
    // return newSpot;
  }
};

export const addImageToSpotById =
  (spotId, imageUrl, isPreview) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: imageUrl,
        preview: isPreview,
      }),
    });

    if (response.ok) {
      const newImage = await response.json();
      dispatch(addImageToSpot(newImage, spotId));
      return newImage;
    }
  };

export const addReviewToSpotById = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    // const newImage = await response.json();
    // dispatch(addImageToSpot(newImage, spotId));
    // return newImage;
  }
};
export const deleteSpotById = (spotId) => async () => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  return response;
};
// Reducer
const initialState = { allSpots: {}, spotDetails: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newSpots = {};
      action.payload.forEach((spot) => {
        newSpots[spot.id] = spot;
      });
      return { ...state, allSpots: newSpots };
    }
    case LOAD_SPOT_DETAILS: {
      const { payload } = action;
      return {
        ...state,
        spotDetails: { ...state.spotDetails, [payload.id]: payload },
      };
    }
    case LOAD_SPOTS_CURRENT_USER: {
      const currentUserSpots = {};
      action.payload.forEach((spot) => {
        currentUserSpots[spot.id] = spot;
      });

      return {
        ...state,
        allSpots: {
          ...currentUserSpots,
        },
      };
    }
    case CREATE_SPOT: {
      const newState = { ...state };
      newState.allSpots[action.payload.id] = action.payload;
      return newState;
    }
    case ADD_IMAGE_TO_SPOT: {
      const { image, spotId } = action.payload;
      const newState = {
        ...state,
        spotDetails: { ...state.spotDetails },
      };
      if (!newState.spotDetails[spotId]) {
        newState.spotDetails[spotId] = { SpotImages: [] };
      } else if (!newState.spotDetails[spotId].SpotImages) {
        newState.spotDetails[spotId].SpotImages = [];
      }
      newState.spotDetails[spotId].SpotImages.push(image);
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
