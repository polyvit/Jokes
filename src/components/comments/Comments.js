import { useState, useEffect, useCallback } from "react";
import useHttp from "../../hooks/use-http";
import { getComments } from "../../utils/firebase-api";
import { useParams } from "react-router-dom";

import styles from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import CommentsList from "./CommentsList";
import Loader from "../UI/Loader";

const Comments = () => {
  const params = useParams();
  const { jokeId } = params;
  const [isAddingComment, setIsAddingComment] = useState(false);
  const {
    sendHttpRequest,
    status,
    data: loadedComments,
    error,
  } = useHttp(getComments, true);

  useEffect(() => {
    sendHttpRequest(jokeId);
  }, [sendHttpRequest, jokeId]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  const commentWasAddedHandler = useCallback(() => {
    sendHttpRequest(jokeId);
    setIsAddingComment(false);
  }, [sendHttpRequest, jokeId]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className="centered focused">{error}</p>;
  }
  if (status === "completed" && loadedComments && loadedComments.length > 0) {
    comments = <CommentsList comments={loadedComments} />;
  }
  if (
    status === "completed" &&
    (!loadedComments || loadedComments.length === 0)
  ) {
    comments = <p className="centered">No comments yet</p>;
  }

  return (
    <section className={styles.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          commentWasAdded={commentWasAddedHandler}
          jokeId={jokeId}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
