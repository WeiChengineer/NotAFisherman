// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function UserMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);
  const [showSignUpModal, setSignUpModal] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    toggleDropdown();
    navigate("/");
  };
  const updateLoginModalVisibility = () => {
    setLoginModal(!showLoginModal);
  };
  const updateSignUpModalVisibility = () => {
    setSignUpModal(!showSignUpModal);
  };

  return (
    <>
      {user ? (
        <NavLink to="/my-spot">
          <li>
            <p>Create a spot</p>
          </li>
        </NavLink>
      ) : null}
      <li onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBars} />
        <FontAwesomeIcon icon={faUser} />

        {showDropdown ? (
          <ul className="nav-dropdown">
            {user ? (
              <>
                <li
                  className="menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Hello {user.firstName} <span>{user.email}</span>
                </li>
                <NavLink to="/my-spots">
                  <li className="menu-item">Manage Spots</li>
                </NavLink>
                <li className="menu-item" onClick={logout}>
                  Logout
                </li>
              </>
            ) : (
              <>
                <li className="menu-item" onClick={updateLoginModalVisibility}>
                  Login
                </li>
                <li className="menu-item" onClick={updateSignUpModalVisibility}>
                  SignUp
                </li>
              </>
            )}
          </ul>
        ) : null}
      </li>
      {showLoginModal ? (
        <LoginFormModal
          visible={showLoginModal}
          onClose={updateLoginModalVisibility}
        />
      ) : null}
      {showSignUpModal ? (
        <SignupFormModal
          visible={showSignUpModal}
          onClose={updateSignUpModalVisibility}
        />
      ) : null}
    </>
  );
}

export default UserMenu;
