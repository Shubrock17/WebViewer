import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Notificaton = ({ comment, author, id, pptid, slide }) => {
  const [flag, setflag] = useState(true);
  const [flag1, setflag1] = useState(true);
  const acceptComment = () => {
    const body = { id: id };
    axios
      .put(`http://localhost:5000/ppt/user/${pptid}/commentsreq`, body)
      .then((resp) => {
        setflag(false);
        console.log(resp.data);
      })
      .catch((err) => console.log(err));
  };
  const rejectComment = () => {
    const body = { id: id };
    axios
      .delete(`http://localhost:5000/ppt/user/${pptid}/commentsreq`,  { data: body })
      .then((resp) => {
        setflag1(false);
        console.log(resp.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div style={flag && flag1 ? {} : { display: "none" }}>
      <div
        className="recommendation border-box"
        style={{ width: "40%", border: "3px solid black", borderRadius: "5%" }}
      >
        <div className="text-center" style={{ margin: "2%" }}>
          Commentor : {author}
        </div>
        <div className="text-center" style={{ margin: "2%" }}>
          Suggesttion : {comment}
        </div>
        <div className="text-center" style={{ margin: "2%" }}>
          PPT Name : {pptid}
        </div>
        <div className="text-center" style={{ margin: "2%" }}>
          Slide Id : {slide}
        </div>
        <div className="buttons">
          <button
            style={{ margin: "2%" }}
            type="button"
            onClick={() => {
              acceptComment();
            }}
          >
            <span>
              <FontAwesomeIcon icon={faCheck} />
              <span className="text-primary">Accept</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              rejectComment();
            }}
          >
            <span>
              <FontAwesomeIcon icon={faTimes} />
              <span className="text-primary">Reject</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notificaton;
