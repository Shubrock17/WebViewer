import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "./Comments.scss";
//Comment box for our view
const CommentBox = ({ pptname, pageNumber, numPages,currentuser,pptuser }) => {
  const [showComments, setshowComments] = useState(false);
  const [comments, setcomments] = useState([]);
  const [flag, setflag] = useState(false);
  const [isaf, setisaf] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/ppt/${pptname}/comments`)
      .then((resp) => {
        // console.log(resp.data);
        resp.data.map((comment) => {
          let mycomm = {
            id: comment.id,
            author: comment.author,
            body: comment.comment,
            slideid: comment.slideid,
          };
          setcomments((comments) => comments.concat(mycomm));
        });
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
    if(currentuser===pptuser){
      const bodytosend = {
        pptid: pptname,
        id: comments.length + 1,
        author: author,
        comment: body,
        slideid: pageNumber,
        isaccepted:true
      };
      axios
      .post(`http://localhost:5000/ppt/${pptname}/comments`, bodytosend)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
    }
    else{
      const bodytosend = {
        pptid: pptname,
        id: comments.length + 1,
        author: author,
        comment: body,
        slideid: pageNumber,
        isaccepted:false
      };
      axios
      .post(`http://localhost:5000/ppt/${pptname}/comments`, bodytosend)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
    }
    
    setcomments((comments) => comments.concat(comment));
    
  };
  const _handleClick = () => {
    setshowComments(!showComments);
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

  const checkComments = (pageNumber) => {
    const length = comments.filter((x) => x.slideid === pageNumber).length;
    if (length === 0) {
      setflag(false);
    } else {
      setflag(true);
    }
  };

  useEffect(() => {
    checkComments(pageNumber);
  }, [pageNumber]);

  return (
    <>
      <p>
        Page{" "}
        <span className={flag ? "redclass" : " "}>
          {" "}
          {pageNumber || (numPages ? 1 : "--")}
        </span>{" "}
        of {numPages || "--"}
      </p>

      <div className="comment-box" style={{
          float: "left",
          margin: "2%",
          height: "400px",
          marginTop: "1%",
          overflow: "auto",
        }}>
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
