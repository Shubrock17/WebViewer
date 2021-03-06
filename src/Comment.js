import React from "react";

//Retruns comments
const Comment = (props) => {
  return (
    <>
      <div className="comment">
        <p className="comment-header">{props.author}</p>
        <p className="comment-body">- {props.body}</p>
      </div>
    </>
  );
};
export default Comment;
