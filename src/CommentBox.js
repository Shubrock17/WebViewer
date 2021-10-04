import React, { useState,useEffect } from "react";
import axios from 'axios';
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "./Comments.scss";

const CommentBox = (props) => {
  const [showComments, setshowComments] = useState(false);
  const [comments, setcomments] = useState([
    {
      id: 1,
      author: "khushi",
      body: "sample comment",
    },
  ]);
  useEffect(() => {
      axios.get(`http://localhost:5000/ppt/${props.pptname}`).then((resp)=>{console.log(resp);

      }).catch((err)=>console.log(err));
  }, [props.pptname])
  const _addComment = (author, body) => {
    const comment = {
      id: comments.length + 1,
      author,
      body,
    };
    const bodytosend = {
        pptid:props.pptname,
        id: comments.length + 1,
        author:author,
        comment:body,
        slideid:1
     };
    setcomments((comments) => comments.concat(comment));
    axios.post(`http://localhost:5000/ppt/${props.pptname}/comments`,bodytosend).then((resp)=>{
        console.log(resp);
    }).catch((err)=> console.log(err));
  };
  const _handleClick = () => {
    setshowComments(!showComments);
  };

  const _getComments = () => {
    return comments.map((comment) => {
      return (
        <Comment author={comment.author} body={comment.body} key={comment.id} />
      );
    });
  };

  const _getCommentsTitle = (commentCount) => {
    if (commentCount === 0) {
      return "No comments yet";
    } else if (commentCount === 1) {
      return "1 comment";
    } else {
      return `${commentCount} comments`;
    }
  };
  return (
    <div className="comment-box">
      <h2>Join the Discussion!</h2>
      <CommentForm addComment={_addComment} />
      <button id="comment-reveal" onClick={_handleClick}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      <h3>Comments</h3>
      <h4 className="comment-count">{_getCommentsTitle(comments.length)}</h4>
      {showComments && (
        <div className="comment-list">
          {comments && comments.length > 0 ? _getComments() : ""}
        </div>
      )}
    </div>
  );
};
export default CommentBox;
