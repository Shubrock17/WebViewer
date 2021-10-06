import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./Comments.scss";
import CommentBox from "./CommentBox";
const Viewer = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  console.log(props);
  console.log(props.pdf);
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
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
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
        <div
          style={{
            float: "left",
            margin: "2%",
            height: "440px",
            marginTop: "-1%",
            overflow: "auto",
          }}
        >
          <CommentBox pptname={props.filename} />
        </div>
    </>
  );
};

export default Viewer;
