export default class CommentsModel {
  constructor() {
    this._comments = [];

    this._dataChangeListeners = [];
  }

  get comments() {
    return this._comments;
  }

  set comments(comments = []) {
    this._comments = Array.from(comments);
    this._callListeners(this._dataChangeListeners);
  }

  getCommentsForFilm(film) {
    return film.comments.map((id) => {
      return this._comments.find((comment) => comment.id === id);
    });
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    this._callListeners(this._dataChangeListeners);

    return true;
  }

  addComment(comment) {
    this._comments = [].concat(comment, this._comments);
    this._callListeners(this._dataChangeListeners);
  }

  setDataChangeListener(listener) {
    this._dataChangeListeners.push(listener);
  }

  _callListeners(listeners) {
    listeners.forEach((listener) => listener());
  }
}
