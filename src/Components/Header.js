import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
import { logout } from "../Config";


//Navigation Bar for the Application
const Header = () => {
  const [activeIndex, setactiveIndex] = useState(null);
  const handleClick = (index) => setactiveIndex(index);
  const history = useHistory();
  const clickables = [
    { name: "Home" },
    { name: "My View" },
    { name: "Pdftron View" },
    { name: "Upload" },
    { name: "SignOut" },
  ];

  const log = () => {
    logout();
    history.replace("/");
    window.location.reload();
  };

  //if signout is clicked then redirecting it to login page 
  useEffect(() => {
    if (activeIndex === 4) {
      log();
    }
  }, [activeIndex]);
  return (
    <div>
      <ul>
        {clickables.map((clickable, i) => {
          return (
            <Navbar
              key={clickable.name}
              name={clickable.name}
              index={i}
              isActive={activeIndex === i}
              onClick={handleClick}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Header;
