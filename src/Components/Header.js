import React, {useState,useEffect} from 'react';
import Navbar from './Navbar';
import { Link, useHistory } from "react-router-dom";
import { logout } from "../Config";

const Header = () => {
  const [activeIndex, setactiveIndex] = useState(null)
  const handleClick = (index) => setactiveIndex(index);
  const history = useHistory();
  const clickables = [
    { name: "Home" },
    { name: "My Files"},
    { name: "All Files"},
    { name: "Upload" },
    { name: "SignOut" }
  ];
  useEffect(() => {
    if (activeIndex===3) {
      logout();
      history.replace("/dashboard")};
  }, [activeIndex]);
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
  </ul>
</div>
  )
}

export default Header;

// class Header extends Component {
//   state = {
//     activeIndex: null
//   }
  
//   const history = useHistory();
//   handleClick = (index) => this.setState({ activeIndex: index });
//   render() {
//     const clickables = [
//     { name: "Home" },
//     { name: "AllFiles" },
//     { name: "Upload" },
//     { name: "SignOut" }
//   ];
//   const test=(name)=> {
//       if(name==="SignOut")
//       {
//         //redirect to login
        
//       }
//       else{
//         this.handleClick();
//       }
//   }
//   return (
//     <div>
//     <ul>
//       { clickables.map((clickable, i) => {
//           return <Navbar 
//             key={ clickable.name }
//             name={ clickable.name }
//             index={ i }
//             isActive={ this.state.activeIndex === i }
//             onClick={
//               test(clickable.name)}
//              // this.handleClick }
//           />
//         })
//       }
//   </ul>
// </div>
//   )
//   }
// }
