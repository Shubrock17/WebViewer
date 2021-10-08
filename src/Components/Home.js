import React, { useState, useEffect } from "react";
import Pdftron from "./Pdftron";
import axios from "axios";
import { auth } from "../Config";
import { useAuthState } from "react-firebase-hooks/auth";
const Home = () => {
  const [user] = useAuthState(auth);
  const [filelist, setfilelist] = useState(null);
  const [fileset, setfileset] = useState();
  const [boolean, setboolean] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/ppt/user/${user._delegate.email}`)
      .then((resp) => {
        console.log(resp.data);
        setfilelist(resp.data);
      })
      .catch((err) => console.log(err));
  }, [user]);
  const showViewer = (value) => {
    setboolean(true);
    setfileset(value);
  };
  const DisplayImagesFromContainer = () => (
    <div>
      
      <h1 style={{fontFamily:"georgia",display: "flex",flexDirection: "column",justifyContent: "center",textAlign: "center",height:"0px"}} >List of my files</h1>
      <ul style={{ display: "block" }}>
        {filelist.map((item) => {
          return (
            <>
            
              <li style={{  listStyle: "square"}}
                onClick={(event) => {
                  console.log(item.pdfurl);
                  showViewer(item.pdfurl);
                }}
              >
                {item.name}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      
      {!boolean && filelist && DisplayImagesFromContainer()}
      {boolean && fileset && (
          <div>
            <Pdftron url={fileset} />
          </div>
      )}
      {console.log(fileset)}
    </>
  );
};
export default Home;
