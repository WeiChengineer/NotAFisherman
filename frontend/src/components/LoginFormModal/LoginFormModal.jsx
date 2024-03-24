// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginFormModal.css";
import Modal from "../Modal";

function LoginFormModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(onClose)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).then(onClose);
  };

  const isLoginDisabled = credential.length < 4 || password.length < 6;

  return (
    <>
      <Modal
        body={
          <>
            <div className="form-container">
              {errors.credential && (
                <p className="error-message">{errors.credential}</p>
              )}
              <form onSubmit={handleSubmit} className="form">
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  required
                  placeholder="Username "
                  className="input-field"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="input-field"
                />
              </form>
            </div>
          </>
        }
        visible={visible}
        onClose={onClose}
        header="Login"
        primaryBtnTitle={"Login"}
        primaryBtnDisabled={isLoginDisabled}
        primaryBtnFunction={handleSubmit}
        secondaryBtnTitle={" Demo User"}
        secondaryBtnFunction={handleDemoLogin}
        isSecondaryBtnLink={true}
      />
    </>
  );
}

export default LoginFormModal;
