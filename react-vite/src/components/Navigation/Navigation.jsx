import { NavLink } from "react-router-dom";
// import ProfileButton from "./ProfileButton";
import Sidebar from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Panda Mart</NavLink>
      </li>

      <li>
        {/* <ProfileButton /> */}
        <Sidebar />
      </li>
    </ul>
  );
}

export default Navigation;
