import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import Viewer from "../Viewer";

const MyView = () => {
  const [filelist, setfilelist] = useState(null);
  const [boolean, setboolean] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:5000/ppt")
      .then((resp) => {console.log(resp.data);
        setfilelist(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const [fileset, setfileset] = useState();
const showViewer=(value)=>{
  setboolean(true);
  setfileset(value);
}
  const DisplayImagesFromContainer = () => (
    <div >
      <h1 style={{fontFamily:"georgia",display: "flex",flexDirection: "column",justifyContent: "center",textAlign: "center",height:"0px"}} >List of all files</h1>
      <ul style={{display:"block"}}>
        {filelist.map((item) => {
          return (
            <>
             {!item.isprivate&& <li style={{  listStyle: "square"}} onClick={(event)=>{showViewer(item.pdfurl)}}>{item.name}</li>}
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {!boolean&&filelist && DisplayImagesFromContainer()}
      {boolean&&<div>
        <Viewer
          pdf={
            fileset
          }
          filename={fileset}
        />
      </div>}
    </>
  );
};

export default MyView;
