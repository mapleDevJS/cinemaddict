import Abstract from "../abstract";
import moment from "moment";
import {getDuration, pluralize} from "../../util/util";

const CARD_CONTROLS = [
  [`isInWatchlist`, `add-to-watchlist`, `Add to watchlist`],
  [`isInHistory`, `mark-as-watched`, `Mark as watched`],
  [`isInFavorites`, `favorite`, `Mark as favorite`]
];

const MAX_DESCRIPTION_LENGTH = 140;
export default class FilmCard extends Abstract {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return (
      `<article class="film-card">
        <h3 class="film-card__title">${this._movie.title}</h3>
        <p class="film-card__rating">${this._movie.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._movie.release).year()}</span>
          <span class="film-card__duration">${getDuration(this._movie.runtime)}</span>
          <span class="film-card__genre">${this._movie.genres.length ? this._movie.genres[0] : ``}</span>
        </p>
        <img src="./${this._movie.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._getDescription()}</p>
        <a class="film-card__comments">${this._movie.comments.length} ${pluralize(this._movie.comments.length, [`Comment`, `Comments`])}</a>
        <form class="film-card__controls">
          ${this._getButtonsMarkup()}
        </form>
      </article>`
    );
  }

  _createButtonMarkup(checkingClass, key, value) {
    return (
      `<button
        class="
          film-card__controls-item
          button
          film-card__controls-item--${key} ${this._isClassActive(checkingClass)}">
        ${value}
      </button>`
    );
  }

  _isClassActive(checkingClass) {
    return this._movie[checkingClass] ? `film-card__controls-item--active` : ``;
  }

  _getDescription() {
    return (this._movie.description.length > MAX_DESCRIPTION_LENGTH)
      ? `${this._movie.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
      : this._movie.description;
  }

  _getButtonsMarkup() {
    return CARD_CONTROLS
      .map(([checkingClass, key, value]) => this._createButtonMarkup(checkingClass, key, value))
      .join(`\n`);
  }

  setPosterClickListener(listener) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, listener);
  }

  setTitleClickListener(listener) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, listener);
  }

  setCommentsClickListener(listener) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, listener);
  }

  setAddToWatchlistClickListener(listener) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        listener();
      });
  }

  setAlreadyWatchedClickListener(listener) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      listener();
    });
  }

  setAddToFavouriteClickListener(listener) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      listener();
    });
  }
}
