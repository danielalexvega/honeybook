import { FC } from "react";
import { Link } from "react-router-dom";

const Logo: FC = () => (
  <Link to="/">
    <div className="flex items-center">
      <img 
        src="/HoneyBook logo.svg" 
        alt="HoneyBook" 
        className="w-auto"
        style={{ maxWidth: '160px', maxHeight: '30px' }}
      />
    </div>
  </Link>
);

export default Logo;