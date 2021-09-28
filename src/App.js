import React, { useState } from "react";
import uploadFileToBlob, { isStorageConfigured } from "./azureUpload";
import axios from "axios";
import pdfjsLib from "pdfjs";
import { Document, Page } from "react-pdf";
//import ConvertApi from "convertapi-js"
//var pdfjsLib = window['pdfjs-dist/build/pdf'];

const storageConfigured = isStorageConfigured();
const App = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [blobList, setBlobList] = useState();
  const [temp, settemp] = useState();
  const [pdfDetails, setpdfDetails] = useState({
    pdf: null,
    currentPage: 1,
    zoom: 1,
  });
  // pdfjsLib
  //   .getDocument("http://www.africau.edu/images/default/sample.pdf")
  //   .promise.then((pdf) => {
  //     setpdfDetails({ pdf: pdf });
  //     Func();
  //   });
  function Func() {
    pdfDetails.pdf.getPage(pdfDetails.currentPage).then((page) => {
      var canvas = document.getElementById("pdf_renderer");
      var ctx = canvas.getContext("2d");

      var viewport = page.getViewport(2);

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      page.render({
        canvasContext: ctx,
        viewport: viewport,
      });
    }); 
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // const [convertedPdf, setconvertedPdf] = useState();
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const [base64String, setbase64String] = useState();
  const onFileChange = (event) => {
    setFileSelected(event.target.files[0]);
  };

  //To Convert PPT  into PDF

  const convert = async (blobList) => {
    // const secret="Secret=eEmtRu9t9Yt61IZh"
    // axios.post(`https://v2.convertapi.com/convert/pptx/to/pdf/${secret}`);
    // const body={
    //   "Parameters": [
    //     {
    //         "Name": "File",
    //         "FileValue": {
    //             "Name": fileSelected.Name,
    //             "Data": reader
    //         }
    //     }
    // ]
    // }
  };

  const onFileUpload = async () => {
    console.log(fileSelected.type);
    if (
      fileSelected.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      fileSelected.type !== ".ppt"
    ) {
      setUploading(true);
      const blobsInContainer = await uploadFileToBlob(fileSelected);
      setBlobList(blobsInContainer);
      setFileSelected(null);
      setUploading(false);
      setInputKey(Math.random().toString(36));
      // convert(blobList);
      const reader = new FileReader();
      reader.onloadend = () => {
        // use a regex to remove data url part
        const bs64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        // log to console
        // logs wL2dvYWwgbW9yZ...
        console.log(bs64String);
        setbase64String(bs64String);
      };
      reader.readAsDataURL(fileSelected);
      const Secret = "eEmtRu9t9Yt61IZh";
      console.log(fileSelected.name);
      console.log(fileSelected);
      const body = {
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: "my_file.doc",
              Data: `${base64String}`,
            },
          },
        ],
      };
      axios
        .post(`https://v2.convertapi.com/upload`, body, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            url: blobList,
          },
        })
        .then((val) => {
          console.log(val);
          axios
            .post(`https://v2.convertapi.com/convert/ppt/to/pdf`, null, {
              params: {
                Secret: "eEmtRu9t9Yt61IZh",
                File: `${val.data.FileId}`,
              },
            })
            .then((res) => {
              console.log(res);
              settemp(res.data.Files[0].FileData);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
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
      <div>
        <Document file={temp} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    </div>
  );
};

export default App;
