import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./Comments.scss";
import CommentBox from "./CommentBox";
import jsPDF from "jspdf";
import axios from "axios";
import PDFMerger from "pdf-merger-js/browser";

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
    const url = URL.createObjectURL(mergedPdf);
    // console.log(mergedPdf);
    // console.log(url);

    var mergedpdf = new Blob([mergedPdf], { type: 'application/pdf' });
    console.log(mergedpdf);
    
    setMergedPdfUrl(url);
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

        // doc.save(`${props.filename}.pdf`);
        
        //pdfs to be merged
        var files = [blob, blobPDF];
        //console.log(files);
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
      <button style={{marginTop:"-1%",marginLeft:"2%"}}onClick={test}>Download PPT</button>
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
