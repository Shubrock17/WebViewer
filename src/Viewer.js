import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./Comments.scss";
class CommentBox extends React.Component {
  constructor() {
    super();

    this.state = {
      showComments: false,
      comments: [
        {
          id: 1,
          author: "landiggity",
          body: "This is my first comment on this forum so don't be a dick",
        },
        {
          id: 2,
          author: "scarlett-jo",
          body: "That's a mighty fine comment you've got there my good looking fellow...",
        },
        {
          id: 3,
          author: "rosco",
          body: "What is the meaning of all of this 'React' mumbo-jumbo?",
        },
      ],
    };
  }

  render() {
    const comments = this._getComments();
    let commentNodes;
    let buttonText = "Show Comments";

    if (this.state.showComments) {
      buttonText = "Hide Comments";
      commentNodes = <div className="comment-list">{comments}</div>;
    }

    return (
      <div className="comment-box">
        <h2>Join the Discussion!</h2>
        <CommentForm addComment={this._addComment.bind(this)} />
        <button id="comment-reveal" onClick={this._handleClick.bind(this)}>
          {buttonText}
        </button>
        <h3>Comments</h3>
        <h4 className="comment-count">
          {this._getCommentsTitle(comments.length)}
        </h4>
        {commentNodes}
      </div>
    );
  } // end render

  _addComment(author, body) {
    const comment = {
      id: this.state.comments.length + 1,
      author,
      body,
    };
    this.setState({ comments: this.state.comments.concat([comment]) }); // *new array references help React stay fast, so concat works better than push here.
  }

  _handleClick() {
    this.setState({
      showComments: !this.state.showComments,
    });
  }

  _getComments() {
    return this.state.comments.map((comment) => {
      return (
        <Comment author={comment.author} body={comment.body} key={comment.id} />
      );
    });
  }

  _getCommentsTitle(commentCount) {
    if (commentCount === 0) {
      return "No comments yet";
    } else if (commentCount === 1) {
      return "1 comment";
    } else {
      return `${commentCount} comments`;
    }
  }
} // end CommentBox component

class CommentForm extends React.Component {
  render() {
    return (
      <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
        <div className="comment-form-fields">
          <input
            placeholder="Name"
            required
            ref={(input) => (this._author = input)}
          ></input>
          <br />
          <textarea
            placeholder="Comment"
            rows="4"
            required
            ref={(textarea) => (this._body = textarea)}
          ></textarea>
        </div>
        <div className="comment-form-actions">
          <button type="submit">Post Comment</button>
        </div>
      </form>
    );
  } // end render

  _handleSubmit(event) {
    event.preventDefault(); // prevents page from reloading on submit
    let author = this._author;
    let body = this._body;
    this.props.addComment(author.value, body.value);
  }
} // end CommentForm component

class Comment extends React.Component {
  render() {
    return (
      <div className="comment">
        <p className="comment-header">{this.props.author}</p>
        <p className="comment-body">- {this.props.body}</p>
        <div className="comment-footer">
          <a
            href="#"
            className="comment-footer-delete"
            onClick={this._deleteComment}
          >
            Delete Comment
          </a>
        </div>
      </div>
    );
  }
  _deleteComment() {
    alert("-- DELETE Comment Functionality COMMING SOON...");
  }
}

//ReactDOM.render(<CommentBox />, document.getElementById('main'));

const Viewer = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  const { pdf } = props;
  return (
    <>
      <Document
        file={pdf}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
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
      <CommentBox style={{}}></CommentBox>
    </>
  );
};

export default Viewer;
