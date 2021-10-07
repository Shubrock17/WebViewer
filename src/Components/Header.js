import React, {useState,useEffect} from 'react';
import Navbar from './Navbar';
import { useHistory } from "react-router-dom";
import { logout } from "../Config";


const Header = () => {
  const [activeIndex, setactiveIndex] = useState(null)
  const handleClick = (index) => setactiveIndex(index);
  const history = useHistory();
  const clickables = [
    { name: "Home" },
    { name: "My View"},
    { name: "Pdftron View"},
    { name: "Upload" },
    { name: "SignOut" }
  ];

  const log=()=>{
    logout();
    history.replace('/');
    window.location.reload(); 
  }
  useEffect(() => {
    if (activeIndex===4) {
      log();
  }}, [activeIndex]);
  return (
    <div>
    <ul>
      { clickables.map((clickable, i) => {
          return <Navbar 
            key={ clickable.name }
            name={ clickable.name }
            index={ i }
            isActive={ activeIndex === i }
            onClick={
              handleClick
          }
          />
        })
      }
      {/* <li>
        <Link to={"/"} refresh="true">
              <button onClick={log}>SignOut</button>
        </Link>
        
      </li> */}
  </ul>
</div>
  )
}

export default Header;
