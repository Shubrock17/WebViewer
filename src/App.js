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
  

 
  // const DisplayImagesFromContainer = () => (
  //   <div>
  //     <ul>{blobList}</ul>
  //   </div>
  // );
  return (
    <>
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/SignUp" component={SignUp} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </div>
    <div>
      <Header/>
      <Main/>

      {/* {storageConfigured && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
      <div id="pdf_renderer"></div>
      {console.log(fileset)}
      {temp&&fileset&&
        <div>
         <Viewer pdf={temp} filename={fileset} />
        </div> */}
    </div>
    </>
  );

};

export default App;
