import React from "react";
import { useState } from "react";
import Viewer from "../Viewer";
import uploadFileToBlob, { isStorageConfigured } from "../azureUpload";

const storageConfigured = isStorageConfigured();
const MyFiles = () => {
  const [fileset, setfileset] = useState();
  const [temp, settemp] = useState();
  const [blobList, setBlobList] = useState();

  const DisplayImagesFromContainer = () => (
    <div>
      <ul>{blobList}</ul>
    </div>
  );

  return (
    <>
      <h1>This will show all files from storage</h1>
      {storageConfigured && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
      <div id="pdf_renderer"></div>
      {console.log(fileset)}
      <div id="pdf_renderer"></div>
      {console.log(fileset)}
      
        <div>
          <Viewer pdf={'https://v2.convertapi.com/d/qhdmik3ydpjs7u5u6gvc0g04xp9p2zv7/7265e42bruteforce_3_idea.pdf'} filename={fileset} />
        </div>
      
    </>
  );
};

export default MyFiles;
