import Modal from "../Modal";
import "./DeleteModal.css";
import { deleteReviewById } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { deleteSpotById } from "../../store/spots";

const DeleteModal = ({ visible, onClose, itemName, itemId }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (itemName.toLowerCase() === "review") {
      dispatch(deleteReviewById(itemId)).then(() => {
        onClose();
      });
      return;
    }
    dispatch(deleteSpotById(itemId)).then(() => {
      onClose();
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
