import { useRef, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { addComment, getComments } from "../../utils/firebase-api";

import styles from "./NewCommentForm.module.css";
import Loader from "../UI/Loader";

const NewCommentForm = (props) => {
  const commentTextRef = useRef();
  const { commentWasAdded, jokeId } = props;
  const { sendHttpRequest, status, error } = useHttp(addComment);

  useEffect(() => {
    if (status === "completed" && !error) {
      commentWasAdded();
    }
  }, [status, error, commentWasAdded]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    const enteredText = commentTextRef.current.value;
    sendHttpRequest({ commentData: { text: enteredText }, jokeId });
  };

  return (
    <form className={styles.form} onSubmit={submitFormHandler}>
      {status === "pending" && (
        <div className="centered">
          <Loader />
        </div>
      )}
      <div className={styles.control} onSubmit={submitFormHandler}>
        <label htmlFor="comment">Your Comment</label>
        <textarea id="comment" rows="5" ref={commentTextRef}></textarea>
      </div>
      <div className={styles.actions}>
        <button className="btn">Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;
