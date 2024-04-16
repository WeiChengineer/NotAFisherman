import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./NewSpot.css";
import { createNewSpot, addImageToSpotById, getSpotDetails, updateSpot } from "../../store/spots";

const NewSpotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotDetails[spotId]);
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
    images: ["", "", "", ""],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (formData.description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if (!formData.lat) newErrors.lat = "Latitude is required";
    if (!formData.lng) newErrors.lng = "Longitude is required";
    if (!formData.name) newErrors.name = "Name of your spot is required";
    if (!formData.price) newErrors.price = "Price per night is required";
    if (!formData.previewImage) newErrors.previewImage = "Preview Image URL is required";
    else if (!formData.previewImage.match(/\.(jpg|jpeg|png)$/)) newErrors.previewImage = "Preview image URL needs to end in png, jpg, or jpeg";
    formData.images.forEach((img, index) => {
      if (img && !img.match(/\.(jpg|jpeg|png)$/)) {
        newErrors[`image${index}`] = `Image URL ${index + 1} needs to end in png, jpg, or jpeg`;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith('image')) {
      const index = parseInt(id.replace('image', ''), 10) - 1;
      const updatedImages = [...formData.images];
      updatedImages[index] = value;
      setFormData({ ...formData, images: updatedImages });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const { country, address, city, state, lat, lng, description, name, price, previewImage, images } = formData;
    const spotData = { country, address, city, state, lat, lng, description, name, price: parseFloat(price) };

    if (!spotId) {
      createSpot(spotData, images, previewImage);
    } else {
      updateExistingSpot(spotId, spotData);
    }
  };

  const createSpot = (spotData, images, previewImage) => {
    dispatch(createNewSpot(spotData))
      .then((newSpot) => {
        const imageUploadPromises = previewImage ? [dispatch(addImageToSpotById(newSpot.id, previewImage, true))] : [];
        images.forEach((img) => {
          if (img) imageUploadPromises.push(dispatch(addImageToSpotById(newSpot.id, img, false)));
        });
        return Promise.all(imageUploadPromises).then(() => navigate(`/spots/${newSpot.id}`));
      })
      .catch(handleSubmissionError);
  };

  const updateExistingSpot = (spotId, spotData) => {
    dispatch(updateSpot(spotData, spotId))
      .then(() => navigate(`/spots/${spotId}`))
      .catch(handleSubmissionError);
  };

  const handleSubmissionError = (error) => {
    setErrors(error.data.errors || { general: "An error occurred. Please try again." });
  };

  useEffect(() => {
    if (spotId) {
      dispatch(getSpotDetails(spotId))
        .then(() => setFormData((prev) => ({ ...prev, ...spot, images: spot.SpotImages.map((img) => img.url) })))
        .catch((error) => console.error("Error fetching spot details:", error));
    }
  }, [dispatch, spotId, spot]);

  return (
    <div className="new-spot-container">
      <h1>{spotId ? "Update Your Spot" : "Create a New Spot"}</h1>
      <form onSubmit={handleSubmit} noValidate className="new-spot-form">
        {/* Form fields here */}
        {formData.images.map((img, index) => (
          <div key={`image-input-${index}`}>
            <label htmlFor={`image${index + 1}`}>Image {index + 1} URL</label>
            <input
              id={`image${index + 1}`}
              type="text"
              value={img}
              onChange={handleChange}
            />
            {errors[`image${index}`] && <p className="error-message">{errors[`image${index}`]}</p>}
          </div>
        ))}
        <button type="submit" className="new-spot-btn">{spotId ? "Update Spot" : " Create Spot "}</button>
      </form>
    </div>
  );
};

export default NewSpotPage;
