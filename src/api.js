import Movie from "./models/movie";
import Comment from "./models/comment";

const URL = `https://11.ecmascript.pages.academy/cinemaddict`;

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`${URL}/movies`, {headers})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(films) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    const promises = films.map((film) => {
      return fetch(`${URL}/comments/${film.id}`, {headers})
        .then((response) => response.json())
        .then(Comment.parseComments);
    });

    return Promise.all(promises);
  }
};

export default API;
