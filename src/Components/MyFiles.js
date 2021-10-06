import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import Viewer from "../Viewer";
import uploadFileToBlob, { isStorageConfigured } from "../azureUpload";

const storageConfigured = isStorageConfigured();
const MyFiles = () => {
  const [filelist, setfilelist] = useState(null);
  const [boolean, setboolean] = useState(false);
  const [filepdf, setfilepdf] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:5000/ppt")
      .then((resp) => {console.log(resp.data);
        setfilelist(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const [fileset, setfileset] = useState();
  const [blobList, setBlobList] = useState();
const showViewer=(value)=>{
  setboolean(true);
  setfileset(value);
}
  const DisplayImagesFromContainer = () => (
    <div >
      <ul style={{display:"block"}}>
        {filelist.map((item) => {
          return (
            <>
              <li onClick={(event)=>{showViewer(item.pdfurl)}}>{item.name}</li>
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <h4>This will show all files from storage</h4>
      {!boolean&&filelist && DisplayImagesFromContainer()}
      {boolean&&<div>
        <Viewer
          pdf={
            "https://v2.convertapi.com/d/qhdmik3ydpjs7u5u6gvc0g04xp9p2zv7/7265e42bruteforce_3_idea.pdf"
          }
          filename={fileset}
        />
      </div>}
    </>
  );
};

export default MyFiles;
