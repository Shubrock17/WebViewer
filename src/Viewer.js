import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./Comments.scss";
import CommentBox from "./CommentBox";
import jsPDF from "jspdf";
import axios from "axios";
import PDFMerger from "pdf-merger-js/browser";
import uploadFileToBlob from "./azureUpload";
var convertapi = require("convertapi")("0GUin1JxtDw7KydT");

//Viewer for my view
const Viewer = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [mergedPdfUrl, setMergedPdfUrl] = useState();

  useEffect(() => {
    getComments(pageNumber);
  }, [pageNumber]);
  const getComments = (pageNumber) => {
    return <CommentBox pptname={props.filename} pageNumber={pageNumber} />;
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  const getCurrentPage = (e) => {
    if (pdf === null) return;

    // Get key code
    var code = e.keyCode ? e.keyCode : e.which;

    // If key code matches that of the Enter key
    if (code === 13) {
      var desiredPage = document.getElementById("current_page").valueAsNumber;

      if (desiredPage >= 1 && desiredPage <= numPages) {
        setPageNumber(desiredPage);
        document.getElementById("current_page").value = desiredPage;
      }
    }
  };

  //merge pdfs (adding comments pdf)
  const merge = async (files) => {
    const merger = new PDFMerger();
    await Promise.all(files.map(async (file) => await merger.add(file)));
    const mergedPdf = await merger.saveAsBlob();
    //const url = URL.createObjectURL(mergedPdf);
    //var mergedpdf = new Blob([mergedPdf], { type: 'application/pdf' });
    const pdfurlcloud = await uploadFileToBlob(mergedPdf);
    console.log(pdfurlcloud);
    const resultfinal = await convertapi.convert(
      "pptx",
      {
        File: pdfurlcloud,
      },
      "pdf"
    );
    console.log(resultfinal.response.Files[0].Url);
    setMergedPdfUrl(resultfinal.response.Files[0].Url);
  };
  const test = async () => {
    axios
      .get(`http://localhost:5000/ppt/${props.filename}/comments`)
      .then(async (resp) => {
        var obj;
        obj = resp.data;
        var doc = new jsPDF("p", "pt");
        doc.text(250, 20, "Comments");
        let x = 20;
        let y = 60;
        obj.map((comment) => {
          doc.text(x, y, `Comment : ${comment.comment}`);
          y += 20;
          doc.text(x, y, `Author : ${comment.author}`);
          y += 20;
          doc.text(x, y, `SlideId : ${comment.slideid}`);
          y += 20;
          doc.text(x, y, `Time : ${comment.updatedAt}`);
          y += 20;
          doc.text(x, y, "");
          y += 20;
          if (y >= 720) {
            doc.addPage();
            doc.setFont("helvetica");
            y = 60;
          }
        });
        doc.setFont("helvetica");
        var blobPDF = new Blob([doc.output("blob")], {
          type: "application/pdf",
        });
        //converting our pdf file to blob
        let blob = await fetch(props.pdf).then((r) => r.blob());
        //pdfs to be merged
        var files = [blob, blobPDF];
        merge(files);
      });
  };
  const pdf = props.pdf;
  return (
    <>
      <div
        style={{ float: "left", width: "60%", margin: "2%", height: "100%" }}
      >
        <Document
          file={props.pdf}
          options={{ workerSrc: "/pdf.worker.js" }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <div style={{ float: "left", width: "30%", margin: "2%" }}>
        <p>
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </button>
        <input
          id="current_page"
          onKeyPress={(event) => getCurrentPage(event)}
          defaultValue="1"
          type="number"
        />
        <button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
      <div>
        <a href={mergedPdfUrl} download={`${props.filename}`}>
          <button style={{ marginTop: "-1%", marginLeft: "2%" }} onClick={test}>
            Download PPT
          </button>
        </a>
      </div>
      <div
        style={{
          float: "left",
          margin: "2%",
          height: "380px",
          marginTop: "1%",
          overflow: "auto",
        }}
      >
        {getComments(pageNumber)}
      </div>
    </>
  );
};

export default Viewer;
