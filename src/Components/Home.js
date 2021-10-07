import React, { useState, useEffect } from "react";
import Pdftron from "./Pdftron";
import axios from "axios";
import { auth } from "../Config";
import Viewer from "../Viewer";
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
      <ul style={{ display: "block" }}>
        {filelist.map((item) => {
          return (
            <>
              <li
                onClick={(event) => {
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
        <Pdftron url={fileset}/>
      </div>
      //  <div>
      //     <Viewer pdf={fileset} filename={fileset} />
      //   </div>
      )}
      {console.log(fileset)}
      {/* <div>
        <Pdftron url={fileset}/>
      </div> */}
    </>
  );
};
export default Home;
