import "./Modal.css";

const Modal = ({
  onClose,
  visible,
  body,
  header,
  primaryBtnTitle,
  primaryBtnFunction,
  primaryBtnDisabled,
  secondaryBtnTitle,
  secondaryBtnFunction,
  secondaryBtnDisabled,
  isSecondaryBtnLink,
}) => {
  if (!visible) return null;
  const primaryButton = (
    <button
      className="modal__btn"
      onClick={primaryBtnFunction}
      disabled={primaryBtnDisabled}
    >
      {primaryBtnTitle}
    </button>
  );

  const secondaryButton = !secondaryBtnTitle ? null : isSecondaryBtnLink ? (
    <div className="modal__btn link" onClick={secondaryBtnFunction}>
      {secondaryBtnTitle}
    </div>
  ) : (
    <button
      className="modal__btn__secondary"
      onClick={secondaryBtnFunction}
      disabled={secondaryBtnDisabled}
    >
      {secondaryBtnTitle}
    </button>
  );
  return (
    <div className="box modal_active">
      <div className="modal-container" id="m2-o">
        <div className="modal">
          <h1 className="modal__title">{header}</h1>
          <div className="modal__text">{body}</div>
          <div className="modal__footer">
            {primaryButton}
            {secondaryButton}
          </div>

          <a href="#m2-c" className="link-2" onClick={onClose}></a>
        </div>
      </div>
    </div>
  );
};

export default Modal;
