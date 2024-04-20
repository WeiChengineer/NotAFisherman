import { useState, useEffect, useRef } from "react";
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
  const user = useSelector(state => state.session.user); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);
  const [showSignUpModal, setSignUpModal] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const logout = async (e) => {
    e.preventDefault();
    setShowDropdown(false); 
    await dispatch(sessionActions.logout());
    navigate("/"); 
  };

  const updateLoginModalVisibility = () => {
    setLoginModal(!showLoginModal);
  };

  const updateSignUpModalVisibility = () => {
    setSignUpModal(!showSignUpModal);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, showDropdown]);

  return (
    <>
      {user ? (
        <NavLink to="/my-spot">
          <li>
            <p>Create a spot</p>
          </li>
        </NavLink>
      ) : null}
      <li ref={dropdownRef} onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBars} />
        <FontAwesomeIcon icon={faUser} />

        {showDropdown ? (
          <ul className="nav-dropdown">
            {user ? (
              <>
                <li className="menu-item" onClick={e => e.stopPropagation()}>
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
