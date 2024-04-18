import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';
import logo from '../../assets/images/noFishing.png';
import UserMenu from './UserMenu';

const Navigation = ({ isLoaded }) => {
  const currentUser = useSelector((state) => state.session.user);

  return (
    <header className="navigation">
      <div className="navigation-container">
        <NavLink to="/">
          <img src={logo} alt="Home" className="navigation-logo" />
          <span className='logo-text'>NotAFisherman</span>
        </NavLink>
        <nav>
          <ul className="navigation-list">
            {isLoaded && <UserMenu user={currentUser} />}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
