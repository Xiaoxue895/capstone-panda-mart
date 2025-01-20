// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FaUserCircle } from 'react-icons/fa';
// import { thunkLogout } from "../../redux/session";
// import OpenModalMenuItem from "./OpenModalMenuItem";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
// import { NavLink } from "react-router-dom"; 

// function ProfileButton() {
//   const dispatch = useDispatch();
//   const [showMenu, setShowMenu] = useState(false);
//   const user = useSelector((store) => store.session.user);
//   const ulRef = useRef();

//   const toggleMenu = (e) => {
//     e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
//     setShowMenu(!showMenu);
//   };

//   useEffect(() => {
//     if (!showMenu) return;

//     const closeMenu = (e) => {
//       if (ulRef.current && !ulRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("click", closeMenu);

//     return () => document.removeEventListener("click", closeMenu);
//   }, [showMenu]);

//   const closeMenu = () => setShowMenu(false);

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(thunkLogout());
//     closeMenu();
//   };

//   return (
//     <>
//       <button onClick={toggleMenu}>
//         <FaUserCircle />
//       </button>
//       {showMenu && (
//         <ul className={"profile-dropdown"} ref={ulRef}>
//           {user ? (
//             <>
//               <li>{user.username}</li>
//               <li>{user.email}</li>
//               <li>
//                 <button onClick={logout}>Log Out</button>
//               </li>
//               <li>
//                 <NavLink to="/userhome" onClick={closeMenu}>
//                   User Home
//                 </NavLink>
//               </li>
//             </>
//           ) : (
//             <>
//               <OpenModalMenuItem
//                 itemText="Log In"
//                 onItemClick={closeMenu}
//                 modalComponent={<LoginFormModal />}
//               />
//               <OpenModalMenuItem
//                 itemText="Sign Up"
//                 onItemClick={closeMenu}
//                 modalComponent={<SignupFormModal />}
//               />
//             </>
//           )}
//         </ul>
//       )}
//     </>
//   );
// }

// export default ProfileButton;

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import './Sidebar.css'; // Assuming you add styles for the sidebar

function Sidebar() {
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  const user = useSelector((store) => store.session.user);
  const sidebarRef = useRef();

  const toggleSidebar = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to document and triggering closeSidebar
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => setShowSidebar(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeSidebar();
  };

  // Close sidebar when clicking outside of it
  useEffect(() => {
    if (!showSidebar) return;

    const closeSidebarOnClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("click", closeSidebarOnClickOutside);

    return () => {
      document.removeEventListener("click", closeSidebarOnClickOutside);
    };
  }, [showSidebar]);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaUserCircle />
      </button>
      {showSidebar && (
        <div className="sidebar" ref={sidebarRef}>
          <button className="close-btn" onClick={closeSidebar}>X</button>
          {user ? (
            <>
              <div className="sidebar-item">{user.username}</div>
              <div className="sidebar-item">{user.email}</div>
              <div className="sidebar-item">
                <button onClick={logout}>Log Out</button>
              </div>
              <div className="sidebar-item">
                <NavLink to="/userhome" onClick={closeSidebar}>User Home</NavLink>
              </div>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeSidebar}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeSidebar}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;


