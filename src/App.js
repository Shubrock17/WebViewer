import axios from "axios";
import React, { useState } from "react";
import uploadFileToBlob, { isStorageConfigured } from "./azureUpload";
import Viewer from "./Viewer";
import Header from "./Components/Header";
import Main from './Components/Main';
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
var convertapi = require("convertapi")("eEmtRu9t9Yt61IZh");

const storageConfigured = isStorageConfigured();
const App = () => {
  const [blobList, setBlobList] = useState();
  const [temp, settemp] = useState();
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileset, setfileset] = useState();
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const onFileChange = (event) => {
    setFileSelected(event.target.files[0]);
    setfileset(event.target.files[0].name);
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
        console.log(result.response.Files[0]);
        settemp(result.response.Files[0].Url);
      });
  };

  //PPT upload
  const onFileUpload = async () => {
    if(fileSelected!==null){
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
      convert(blobsInContainer);
      const bodytosend={name:fileSelected.name,user:"test_user"}
      axios.post('http://localhost:5000/ppt/',bodytosend).then((resp)=>console.log(resp)).catch((err)=>console.log(err));
    }
    //If uploaded file is not a ppt
    else {
      alert("Invalid File Type! Please select ppt to upload.");
    }
  }
  else{
    alert("Select a ppt to upload !")
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
      <ul>{blobList}</ul>
    </div>
  );
  return (
    <>
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={SignUp} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </div>
    <div>
      <Header/>
      <Main/>
      {/* <h1>Upload file to View</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
      <div id="pdf_renderer"></div>
      {console.log(fileset)}
      {temp&&fileset&&
        <div>
         <Viewer pdf={temp} filename={fileset} />
        </div>
      } */}
    </div>
    </>
  );

};

export default App;
