import { useParams, Route, Link } from "react-router-dom";
import Comments from "../components/comments/Comments";
import { Fragment, useEffect } from "react";
import HighlightedJoke from "../components/jokes/HighlightedJoke";
import useHttp from "../hooks/use-http";
import { getJoke } from "../utils/firebase-api";
import Loader from "../components/UI/Loader";

const JokeDetails = () => {
  const params = useParams();
  const { jokeId } = params;
  const { sendHttpRequest, status, data: joke, error } = useHttp(getJoke, true);

  useEffect(() => {
    sendHttpRequest(jokeId);
  }, [sendHttpRequest, jokeId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className="centered focused">{error}</p>;
  }

  if (!joke.text) {
    return <h1 className="centered">Шуток не найдено</h1>;
  }
  return (
    <Fragment>
      <HighlightedJoke text={joke.text} topic={joke.topic} />
      <Route path={`/jokes/${params.jokeId}`} exact>
        <div className="centered">
          <Link className="btn--empty" to={`/jokes/${params.jokeId}/comments`}>
            Show Comments
          </Link>
        </div>
      </Route>
      <Route path={`/jokes/${params.jokeId}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );
};

export default JokeDetails;
