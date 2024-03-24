// function Navigation({ isLoaded }) {
//   const sessionUser = useSelector((state) => state.session.user);

//   //     return (
//   //         <div classNameName="navigation-container">
//   //             <p>
//   //                 <NavLink to="/">
//   //                     <img src={logo} alt="Logo" classNameName="logo"></img>
//   //                 </NavLink>
//   //             </p>
//   //             {isLoaded && (
//   //                 <div classNameName="profile-button-container">
//   //                     <ProfileButton user={sessionUser} />
//   //                 </div>
//   //             )}
//   //         </div>
//   //     );

// }

import React from "react";
import "./Navigation.css"; // Import your CSS file
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/PokeBnB.png";

import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <>
      <section className="navigation">
        <div className="nav-container">
          <NavLink to="/">
            <img className="header__icon brand" src={logo} alt="" />
          </NavLink>
          <nav>
            <ul className={`nav-list `}>
              {isLoaded ? <UserMenu user={sessionUser} /> : null}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
};

export default Navigation;
