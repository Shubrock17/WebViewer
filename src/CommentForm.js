import React ,{useState}from "react";

const CommentForm=(props)=> {
    const [_author, setauthor] = useState();
    const [_body, set_body] = useState();
    const _handleSubmit=(event) =>{
        event.preventDefault(); 
        let author = _author.value;
        let body = _body.value;
        props.addComment(author, body);
      }
    return (
        <form className="comment-form" onSubmit={(event)=>{_handleSubmit(event)}}>
        <div className="comment-form-fields">
          <input
            placeholder="Name"
            required
            ref={(input) => (setauthor(input))}
          ></input>
          <br />
          <textarea
            placeholder="Comment"
            rows="4"
            required
            ref={(textarea) => (set_body(textarea))}
          ></textarea>
        </div>
        <div className="comment-form-actions">
          <button type="submit">Post Comment</button>
        </div>
      </form>
    )
}

export default CommentForm;