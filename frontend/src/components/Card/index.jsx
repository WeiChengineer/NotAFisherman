import Tooltip from '../Tooltip';
import { FaStar } from 'react-icons/fa';
import './Card.css';
import { Link } from 'react-router-dom';

function Card({ src, title, description, price, rating, id }) {
  return (
    <Tooltip text={title}>
      <Link to={`/spots/${id}`} className="spot-tile-link">
        <div className="card">
          <img src={src} alt={title} /> {}
          <div className="card__info">
            <div className="row justify-between items-center">
              <h4>{description}</h4>
              <div className="rating">
                <FaStar className="star-icon" />
                {rating}
              </div>
            </div>
            <h3>${price} / night</h3> {}
          </div>
        </div>
      </Link>
    </Tooltip>
  );
}

export default Card;
