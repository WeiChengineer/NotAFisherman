import Modal from "../Modal";
import "./DeleteModal.css";
import { deleteReviewById } from "../../store/reviews";
import { deleteSpotById } from "../../store/spots";
import { useDispatch } from "react-redux";

const DeleteModal = ({ visible, onClose, itemName, itemId, onDeleted }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const deleteAction = itemName.toLowerCase() === "review" ? deleteReviewById(itemId) : deleteSpotById(itemId);
    
    dispatch(deleteAction).then(() => {
      onClose();  // Close modal
      onDeleted();  // Callback function to handle UI update
    });
  };

  return (
    <Modal
      body={
        <>
          <p className="delete-modal-content">
            Are you sure you want to delete this {itemName}?
          </p>
        </>
      }
      visible={visible}
      onClose={onClose}
      header="Confirm Delete"
      primaryBtnTitle={`Yes (Delete ${itemName})`}
      primaryBtnFunction={handleDelete}
      secondaryBtnTitle={`No (Keep ${itemName})`}
      secondaryBtnFunction={onClose}
    />
  );
};

export default DeleteModal;
