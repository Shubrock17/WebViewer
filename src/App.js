import React, { useState } from "react";
import uploadFileToBlob, { isStorageConfigured } from "./azureUpload";
import Viewer from "./Viewer";
var convertapi = require("convertapi")("eEmtRu9t9Yt61IZh");

const storageConfigured = isStorageConfigured();
const App = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [blobList, setBlobList] = useState();
  const [temp, settemp] = useState();
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const onFileChange = (event) => {
    setFileSelected(event.target.files[0]);
  };

  //To Convert PPT  into PDF
  const convert = async (blobList) => {
    convertapi
      .convert(
        "pdf",
        {
          File: blobList,
        },
        "pptx"
      )
      .then(function (result) {
       // console.log(result);
        console.log(result.response.Files[0].Url);
        settemp(result.response.Files[0].Url);
        //result.saveFiles('/path/to/dir');
      });
  };

  //PPT upload
  const onFileUpload = async () => {
    console.log(fileSelected.name.split('.').pop());
    //If uploaded file is ppt
    //fileSelected.type ==="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    if (fileSelected.name.split('.').pop() ==="pptx"||fileSelected.name.split('.').pop() ==="ppt") 
    {
      setUploading(true);
      const blobsInContainer = await uploadFileToBlob(fileSelected);
      setBlobList(blobsInContainer);
      setFileSelected(null);
      setUploading(false);
      setInputKey(Math.random().toString(36));

      //convert the updated ppt file to pdf
      //console.log(blobsInContainer);
      convert(blobsInContainer);
    }
    //If uploaded file is not a ppt
    else {
      alert("Invalid File Type! Please select ppt to upload.");
    }
  };



  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
      </button>
    </div>
  );
  const DisplayImagesFromContainer = () => (
    <div>
      <h2>Container items</h2>
      <ul>{blobList}</ul>
    </div>
  );


  return (
    <div>
      <h1>Upload file to Azure Blob Storage</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
      <div id="pdf_renderer"></div>
      {temp&&
        <div>
         <Viewer pdf={temp} />
        </div>
      }
    </div>
  );
};

export default App;
