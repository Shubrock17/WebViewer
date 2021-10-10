import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "./Comments.scss";
import jsPDF from "jspdf";

//Comment box for our view
const CommentBox = ({ pptname, pageNumber }) => {
  const [showComments, setshowComments] = useState(false);
  const [comments, setcomments] = useState([
    {
      id: 1,
      author: "khushi",
      body: "sample comment",
      slideid: 1,
    },
  ]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/ppt/${pptname}`)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
  }, [pptname]);
  const _addComment = (author, body) => {
    const comment = {
      id: comments.length + 1,
      author,
      body,
      slideid: pageNumber,
    };
    const bodytosend = {
      pptid: pptname,
      id: comments.length + 1,
      author: author,
      comment: body,
      slideid: pageNumber,
    };
    setcomments((comments) => comments.concat(comment));
    axios
      .post(`http://localhost:5000/ppt/${pptname}/comments`, bodytosend)
      .then((resp) => {})
      .catch((err) => console.log(err));
  };
  const _handleClick = () => {
    setshowComments(!showComments);
  };
  const test = () => {
    axios.get("http://localhost:5000/ppt/Final_Idea Submission Template_Hackpions edition 3_8d458c00e4f07f.pptx/comments").then((resp)=>{
    var obj;
    obj = resp.data;
    console.log(resp.data[0]);
    var doc = new jsPDF("p", "pt");
    doc.text(250, 20, "Comments");
    let x=20;
    let y=60;
    obj.map((comment) => {
      doc.text(x, y, `Comment : ${comment.comment}`);
      y+=20;
      doc.text(x, y, `Author : ${comment.author}`);
      y+=20;
      doc.text(x, y, `SlideId : ${comment.slideid}`);
      y+=20;
      doc.text(x, y, `Time : ${comment.updatedAt}`);
      y+=20;
      doc.text(x,y,'');
      y+=20;
    })
    doc.setFont("helvetica");
    doc.save("sample-file.pdf");

  })
  };
  const _getComments = () => {
    return comments.map((comment) => {
      return (
        comment.slideid === pageNumber && (
          <Comment
            author={comment.author}
            body={comment.body}
            key={comment.id}
          />
        )
      );
    });
  };
  const getcurrentPageComments = (pageNumber) => {
    const length = comments.filter((x) => x.slideid === pageNumber).length;
    if (length === 0) {
      return "No comments yet";
    } else if (length === 1) {
      return "1 comment";
    } else {
      return `${length} comments`;
    }
  };

  return (
    <>
      <button onClick={test}>Test</button>
      <div className="comment-box">
        <h2>Add Comments</h2>
        <CommentForm addComment={_addComment} />
        <button id="comment-reveal" onClick={_handleClick}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        <h3>Comments</h3>
        <h4 className="comment-count">{getcurrentPageComments(pageNumber)}</h4>
        {showComments && (
          <div className="comment-list">
            {comments && comments.length > 0 ? _getComments() : ""}
          </div>
        )}
      </div>
    </>
  );
};
export default CommentBox;
