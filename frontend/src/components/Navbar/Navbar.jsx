// import React, { useContext, useState, useRef, useEffect } from 'react';
// import './Navbar.css';
// import { assets } from '../../assets/assets';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { StoreContext } from '../../Context/StoreContext';

// const Navbar = ({ setShowLogin }) => {
//   const [menu, setMenu] = useState("home");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const profileRef = useRef(null);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     navigate('/');
//     setShowProfileDropdown(false);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   const toggleProfileDropdown = () => {
//     if (!token) {
//       setShowLogin(true);
//     } else {
//       setShowProfileDropdown(!showProfileDropdown);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (location.pathname === "/") {
//         const scrollPosition = window.scrollY + 200;

//         const exploreMenuSection = document.getElementById("explore-menu");
//         const footerSection = document.getElementById("footer");

//         if (footerSection && scrollPosition >= footerSection.offsetTop - 100) {
//           setMenu("contact");
//         }
//         else if (exploreMenuSection && scrollPosition >= exploreMenuSection.offsetTop) {
//           setMenu("menu");
//         }
//         else {
//           setMenu("home");
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const isHomePage = location.pathname === '/';

//   return (
//     <div className='navbar'>
//       <Link to='/'>
//         <img className='LogoZAYKAA' src={assets.LogoZAYKAA} alt="" />
//       </Link>

//       {isHomePage && (
//         <ul className="navbar-menu">
//           <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>
//             Home
//           </Link>
//           <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>
//             Menu
//           </a>
//           <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>
//             Contact Us
//           </a>
//         </ul>
//       )}

//       <div className="navbar-right">
//         <div className="navbar-search">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search for food..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
//           />
//           <button
//             type="button"
//             className="search-btn"
//             onClick={handleSearch}
//           >
//             <img src={assets.search_icon} alt="Search" className="search-icon" />
//           </button>
//         </div>

//         <Link to='/cart' className='navbar-search-icon'>
//           <img src={assets.basket_icon} alt="" />
//           <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
//         </Link>

//         <div className='navbar-profile' ref={profileRef}>
//           <img
//             src={assets.profile_icon}
//             alt="Profile"
//             onClick={toggleProfileDropdown}
//           />
//           {token && (
//             <ul
//               className='navbar-profile-dropdown'
//               style={{ display: showProfileDropdown ? 'flex' : 'none' }}
//             >
//               <li onClick={() => {
//                 navigate('/myorders');
//                 setShowProfileDropdown(false);
//               }}>
//                 <img src={assets.bag_icon} alt="" />
//                 <p>Orders</p>
//               </li>
//               <hr />
//               <li onClick={logout}>
//                 <img src={assets.logout_icon} alt="" />
//                 <p>Logout</p>
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;





import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setShowProfileDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleProfileDropdown = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setShowProfileDropdown(!showProfileDropdown);
    }
  };

  // Track scroll position and update active menu item on homepage
  useEffect(() => {
    const handleScroll = () => {
      // Only track scroll on home page
      if (location.pathname === "/") {
        const scrollPosition = window.scrollY + 200;

        const exploreMenuSection = document.getElementById("explore-menu");
        const footerSection = document.getElementById("footer");

        // Check footer first (bottom section)
        if (footerSection && scrollPosition >= footerSection.offsetTop - 100) {
          setMenu("contact");
        }
        // Then check explore menu section
        else if (
          exploreMenuSection &&
          scrollPosition >= exploreMenuSection.offsetTop
        ) {
          setMenu("menu");
        }
        // Default to home
        else {
          setMenu("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Update active state based on current route
  useEffect(() => {
    // Set active menu based on current path
    if (location.pathname === "/") {
      // Home page - let scroll tracking handle it
    } else if (location.pathname === "/cart") {
      setMenu("cart");
    } else if (location.pathname === "/myorders") {
      setMenu("orders");
    } else if (location.pathname === "/order") {
      setMenu("checkout");
    } else if (location.pathname.startsWith("/search")) {
      setMenu("search");
    } else {
      setMenu("");
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";

  return (
    <div className="navbar">
      <Link to="/">
        <img className="LogoZAYKAA" src={assets.LogoZAYKAA} alt="" />
      </Link>

      {/* Show menu only on homepage */}
      {isHomePage && (
        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={`${menu === "home" ? "active" : ""}`}
          >
            Home
          </Link>
          <a
            href="#explore-menu"
            onClick={() => setMenu("menu")}
            className={`${menu === "menu" ? "active" : ""}`}
          >
            Menu
          </a>
          <a
            href="#footer"
            onClick={() => setMenu("contact")}
            className={`${menu === "contact" ? "active" : ""}`}
          >
            Contact Us
          </a>
        </ul>
      )}

      <div className="navbar-right">
        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <button type="button" className="search-btn" onClick={handleSearch}>
            <img
              src={assets.search_icon}
              alt="Search"
              className="search-icon"
            />
          </button>
        </div>

        <Link
          to="/cart"
          className={`navbar-search-icon ${
            menu === "cart" ? "active-icon" : ""
          }`}
        >
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        <div
          className={`navbar-profile ${menu === "orders" ? "active-icon" : ""}`}
          ref={profileRef}
        >
          <img
            src={assets.profile_icon}
            alt="Profile"
            onClick={toggleProfileDropdown}
          />
          {token && (
            <ul
              className="navbar-profile-dropdown"
              style={{ display: showProfileDropdown ? "flex" : "none" }}
            >
              <li
                onClick={() => {
                  navigate("/myorders");
                  setShowProfileDropdown(false);
                }}
              >
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
