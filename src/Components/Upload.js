import React from "react";
import { useState } from "react";
import axios from "axios";
import { auth } from "../Config";
import { useAuthState } from "react-firebase-hooks/auth";
import uploadFileToBlob, { isStorageConfigured } from "../azureUpload";
var convertapi = require("convertapi")("0GUin1JxtDw7KydT");

const storageConfigured = isStorageConfigured();
const Upload = () => {
  const [user, loading] = useAuthState(auth);
  const [username, setusername] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [blobList, setBlobList] = useState();
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const [fileset, setfileset] = useState();
  const [temp, settemp] = useState();
  console.log(user._delegate.email);
  const onFileChange = (event) => {
    setFileSelected(event.target.files[0]);
    setfileset(event.target.files[0].name);
  };

  //To Convert PPT  into PDF
  const convert = async (blobsInContainer) => {
    convertapi
      .convert(
        "pdf",
        {
          File: blobsInContainer,
        },
        "pptx"
      )
      .then(async (result) => {
        let response = await fetch(result.response.Files[0].Url);
        let data = await response.blob();
        let metadata = {
          type: 'pdf/pdf'
        };
        let text1=result.response.Files[0].FileName;
        let text2=text1.replace(/ /g, ""); 
        let file = new File([data],text2,metadata);
        const pdfurlcloud = await uploadFileToBlob(file);
        //sending data to backend to upload ppt details
        const bodytosend={
          name:fileSelected.name,
          user:user._delegate.email,
          pdfurl:pdfurlcloud,
          ppturl:blobsInContainer
        }
        axios.post('http://localhost:5000/ppt/',bodytosend).then((resp)=>console.log(resp)).catch((err)=>console.log(err));
      });
  };

  const send2backend = (blobsInContainer, pdfurlcloud) => {
    const bodytosend = {
      name: fileSelected.name,
      user: user._delegate.email,
      pdfurl: pdfurlcloud,
      ppturl: blobsInContainer,
    };
    console.log(bodytosend);
    axios
      .post("http://localhost:5000/ppt/", bodytosend)
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };
  //PPT upload
  const onFileUpload = async () => {
    if (fileSelected !== null) {
      //If uploaded file is ppt
      //fileSelected.type ==="application/vnd.openxmlformats-officedocument.presentationml.presentation"
      if (
        fileSelected.name.split(".").pop() === "pptx" ||
        fileSelected.name.split(".").pop() === "ppt"
      ) {
        setUploading(true);
        setusername(user._delegate.user);
        const blobsInContainer = await uploadFileToBlob(fileSelected);
        convert(blobsInContainer);
        if (temp) {
          const pdfurlcloud = await uploadFileToBlob(temp);
          console.log(pdfurlcloud);
          pdfurlcloud && send2backend(blobsInContainer, pdfurlcloud);
        }
        setBlobList(blobsInContainer);
        setUploading(false);
        setInputKey(Math.random().toString(36));
        setFileSelected(null);
      }
      //If uploaded file is not a ppt
      else {
        alert("Invalid File Type! Please select ppt to upload.");
      }
    } else {
      alert("Select a ppt to upload !");
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

  return (
    <>
      <h1>Upload file</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <br />
      {temp && "Your file has been uploaded successfully"}
      <hr />
    </>
  );
};

export default Upload;
