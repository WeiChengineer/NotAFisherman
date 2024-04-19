// frontend/src/components/NewSpotPage/NewSpotPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./NewSpot.css";
import {
  createNewSpot,
  addImageToSpotById,
  getSpotDetails,
  updateSpot,
} from "../../store/spots";

const NewSpotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotDetails[spotId]);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [images, setImages] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Street Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (description.length < 30)
      newErrors.description = "Description needs 30 or more characters";
    if (!lat || lat < -90 || lat > 90) 
      newErrors.lat = "Latitude must be between -90 and 90 degrees";
    if (!lng || lng < -180 || lng > 180)
      newErrors.lng = "Longitude must be between -180 and 180 degrees";
    if (!name) newErrors.name = "Name of your spot is required";
    if (!price) newErrors.price = "Price per night is required";
    if (!previewImage) newErrors.previewImage = "Preview Image URL is required";
    else if (!previewImage.match(/\.(jpg|jpeg|png)$/))
      newErrors.previewImage = "Preview image URL needs to end in png, jpg, or jpeg";
    return newErrors;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const spotData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price: parseFloat(price),
    };
    if (!spotId) {
      dispatch(createNewSpot(spotData))
        .then((newSpot) => {
          const spotId = newSpot.id;

          const imageUploadPromises = [
            previewImage
              ? dispatch(addImageToSpotById(spotId, previewImage, true))
              : null,
          ];
          images.forEach((img) => {
            if (img) {
              imageUploadPromises.push(
                dispatch(addImageToSpotById(spotId, img, false))
              );
            }
          });

          return Promise.all(imageUploadPromises).then(() => {
            navigate(`/spots/${spotId}`);
          });
        })
        .catch((error) => {

          setErrors(
            error.data.errors || {
              general: "An error occurred. Please try again.",
            }
          );
        });
      return;
    }
    dispatch(updateSpot(spotData, spotId))
      .then((newSpot) => {
        navigate(`/spots/${spotId}`);
      })
      .catch((error) => {
        setErrors(
          error.data.errors || {
            general: "An error occurred. Please try again.",
          }
        );
      });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const imageErrors = images
    .map((_, index) => errors[`image${index}`])
    .filter((error) => error);

  useEffect(() => {
    if (spotId) {
      dispatch(getSpotDetails(spotId))
        .then(() => {
        })
        .catch((error) => {
          console.error("Error fetching spot details:", error);
        });
    }
  }, [dispatch, spotId]);
  useEffect(() => {
    if (spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLat(spot.lat);
      setLng(spot.lng);
      setDescription(spot.description);
      setName(spot.name);
      setPrice(spot.price.toString());
      setPreviewImage(spot.SpotImages[0].url);
    }
  }, [spot]);

  return (
    <div className="new-spot-container">
      <h1>{spotId ? "Update Your Spot" : "Create a New Spot"}</h1>

      <form onSubmit={handleSubmit} noValidate className="new-spot-form">
        <h2>Where&apos;s your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>

        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {errors.country && <p className="error-message">{errors.country}</p>}

        <label htmlFor="address">Street Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {errors.address && <p className="error-message">{errors.address}</p>}

        <div className="new-spot-form-group">
          <div className="w-full">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            {errors.city && <p className="error-message">{errors.city}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            {errors.state && <p className="error-message">{errors.state}</p>}
          </div>
        </div>

        <div className=" new-spot-form-group">
          <div className="w-full">
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
            {errors.lat && <p className="error-message">{errors.lat}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
            {errors.lng && <p className="error-message">{errors.lng}</p>}
          </div>
        </div>

        <hr />
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <label htmlFor="description">Description</label>
        <textarea
          rows={10}
          id="description"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}

        <hr />
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests&apos; attention with a spot title that highlights what
          makes your place special.
        </p>
        <label htmlFor="name"></label>
        <input
          id="name"
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
        <hr />
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>

        <input
          type="number"
          value={price}
          placeholder="Price per night (USD)"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {errors.price && <p className="error-message">{errors.price}</p>}

        <hr />
        <h2> Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>

        <label htmlFor="previewImage"></label>
        <input
          id="previewImage"
          type="text"
          placeholder="Preview Image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
        />
        {errors.previewImage && (
          <p className="error-message">{errors.previewImage}</p>
        )}
        {images.map((img, index) => (
        
            <input
              key={index}
              id={`image${index + 1}`}
              type="text"
              placeholder="Image URL"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
        ))}

        <hr />
        <button type="submit" className="new-spot-btn">
          {spotId ? "Update Spot" : " Create Spot "}
        </button>
      </form>
    </div>
  );
};

export default NewSpotPage;
