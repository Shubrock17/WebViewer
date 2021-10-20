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
  const [wordSearch, setWordSearch] = useState(false);

  console.log(props);

  var https = require("https");

  // Use "npm install request" command to install.
  var request = require("request");

  // The authentication key (API Key).
  // Get your own by registering at https://app.pdf.co
  const API_KEY =
    "saurabh.20316401518@ipu.ac.in_8688c55467178a049f571a3f7def028192ba";

  // Direct URL of source PDF file.
  // You can also upload your own file into PDF.co and use it as url. Check "Upload File" samples for code snippets: https://github.com/bytescout/pdf-co-api-samples/tree/master/File%20Upload/
  const SourceFileUrl =
    "https://bruteforce3.blob.core.windows.net/data/file(5).pdf";

  // Comma-separated list of page indices (or ranges) to process. Leave empty for all pages. Example: '0,2-5,7-'.
  const Pages = "2-4";
  // PDF document password. Leave empty for unprotected documents.
  const Password = "";

  // Search string.
  const SearchString = "to"; // Regular expression to find numbers in format dd.dd and between 40.00 to 99.99

  // Enable regular expressions (Regex)
  const RegexSearch = true;

  // Prepare URL for PDF text search API call.
  // See documentation: https://apidocs.pdf.co
  var queryPath = `/v1/pdf/find`;

  // JSON payload for api request
  var jsonPayload = JSON.stringify({
    password: Password,
    pages: Pages,
    url: SourceFileUrl,
    searchString: SearchString,
    regexSearch: RegexSearch,
    async: true,
  });

  var reqOptions = {
    host: "api.pdf.co",
    method: "POST",
    path: queryPath,
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonPayload, "utf8"),
    },
  };
  // Send request
  var postRequest = https
    .request(reqOptions, (response) => {
      response.on("data", (d) => {
        // Parse JSON response
        var data = JSON.parse(d);
        if (data.error === false) {
          console.log(`Job #${data.jobId} has been created!`);
          checkIfJobIsCompleted(data.jobId, data.url);
        } else {
          // Service reported error
          console.log(data.message);
        }
      });
    })
    .on("error", (e) => {
      // Request error
      console.log(e);
    });

  // Write request data
  postRequest.write(jsonPayload);
  postRequest.end();

  function checkIfJobIsCompleted(jobId, resultFileUrl) {
    let queryPath = `/v1/job/check`;

    // JSON payload for api request
    let jsonPayload = JSON.stringify({
      jobid: jobId,
    });

    let reqOptions = {
      host: "api.pdf.co",
      path: queryPath,
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonPayload, "utf8"),
      },
    };

    // Send request
    var postRequest = https.request(reqOptions, (response) => {
      response.on("data", (d) => {
        response.setEncoding("utf8");

        // Parse JSON response
        let data = JSON.parse(d);
        console.log(data);
        console.log(
          `Checking Job #${jobId}, Status: ${
            data.status
          }, Time: ${new Date().toLocaleString()}`
        );

        if (data.status === "working") {
          // Check again after 3 seconds
          setTimeout(function () {
            checkIfJobIsCompleted(jobId, resultFileUrl);
          }, 3000);
        } else if (data.status === "success") {
          request(
            { method: "GET", uri: resultFileUrl, gzip: true },
            function (error, response, body) {
              // Parse JSON response
              let respJsonFileArray = JSON.parse(body);

              respJsonFileArray.forEach((element) => {
                console.log(element);
                console.log(
                  "Found text " +
                    element["text"] +
                    " at coordinates " +
                    element["left"] +
                    ", " +
                    element["top"]
                );
              }, this);
            }
          );
        } else {
          console.log(`Operation ended with status: "${data.status}".`);
        }
      });
    });

    // Write request data
    postRequest.write(jsonPayload);
    postRequest.end();
  }

  useEffect(() => {
    getComments(pageNumber);
  }, [pageNumber]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }
  const getComments = (pageNumber) => {
    return (
      <CommentBox
        pptname={props.filename}
        pageNumber={pageNumber}
        numPages={numPages}
        currentuser={props.currentuser}
        pptuser={props.pptuser}
      />
    );
  };
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
      <div>
        <a href={mergedPdfUrl} download={`${props.filename}`}>
          <button style={{ marginTop: "1%", marginLeft: "2%" }} onClick={test}>
            Download PPT
          </button>
        </a>
      </div>
      <button
        onClick={() => {
          console.log(wordSearch);
          setWordSearch(true);
        }}
      >
        Add Suggestions
      </button>

      {wordSearch && (
        <div>
          <form>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <form>
            <label>
              Name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
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
      <div
        style={{
          float: "left",
          width: "30%",
          margin: "2%",
          marginBottom: "-1%",
        }}
      >
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
      <div
        style={{
          float: "left",
          margin: "2%",
          height: "380px",
          marginTop: "1%",
          // overflow: "auto",
        }}
      >
        {getComments(pageNumber)}
      </div>
    </>
  );
};

export default Viewer;
