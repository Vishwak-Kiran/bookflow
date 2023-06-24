import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cartImg, logo } from "../assets/index";
import { useUserAuth } from "../context/UserAuthContext";

const Header = () => {
  const { user, logIn, googleSignIn, logOut } = useUserAuth();
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((state) => state.bazar.userInfo);
  const [showLogoutButtons, setShowLogoutButtons] = useState(false);

  const handleIconClick = () => {
    setShowLogoutButtons(!showLogoutButtons);
    console.log("showLogoutButtons: ", showLogoutButtons);
  };
  console.log("Header: ", user);
  return (
    <div className="w-full h-20 bg-white font-titleFont border-b-[1px] border-b-gray-800 sticky top-0 z-50">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between">
        <Link to="/">
          <div>
            <img className="w-40" src={logo} alt="logoDark" />
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <ul className="flex item-center gap-8">
            <Link to="/home">
              <li className="text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300">
                Search
              </li>
            </Link>
            
          </ul>
          <Link to="/cart">
            <div className="relative">
              <img className="w-6" src={cartImg} alt="cartImg" />
              <span className="absolute w-6 top-2 left-0 text-sm flex items-center justify-center font-semibold font-titleFont">
                {productData.length}
              </span>
            </div>
          </Link>
          <img
            className="w-8 h-8 rounded-full cursor-pointer "
            src={
              user.photoURL
                ? user.photoURL
                : "https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt="userLogo"
            onClick={handleIconClick}
          />
            <div className="bg-white border border-gray-300 rounded shadow">
              <button
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                onClick={logOut}
              >
                Log Out
              </button>
              {/* Add additional log out buttons or functionality as needed */}
            </div>

          {user && (
            <p className="text-base font-titleFont font-semibold underline underline-offset-2">
              {user.displayName ? user.displayName : user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
