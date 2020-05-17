import {pluralize} from "../../util/util";
import Abstract from "../abstract";
import moment from "moment";

const CARD_CONTROLS = [
  [`isInWatchlist`, `add-to-watchlist`, `Add to watchlist`],
  [`isInHistory`, `mark-as-watched`, `Mark as watched`],
  [`isInFavorites`, `favorite`, `Mark as favorite`]
];

const MAX_DESCRIPTION_LENGTH = 140;
const MINUTES_IN_HOUR = 60;
export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return (
      `<article class="film-card">
        <h3 class="film-card__title">${this._film.title}</h3>
        <p class="film-card__rating">${this._film.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._film.release).year()}</span>
          <span class="film-card__duration">${this._getFilmDuration()}</span>
          <span class="film-card__genre">${this._film.genres[0]}</span>
        </p>
        <img src="./images/posters/${this._film.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._getDescription()}</p>
        <a class="film-card__comments">${this._film.comments.length} ${pluralize(this._film.comments.length, [`Comment`, `Comments`])}</a>
        <form class="film-card__controls">
          ${this._getButtonsMarkup()}
        </form>
      </article>`
    );
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
    return this._film[checkingClass] ? `film-card__controls-item--active` : ``;
  }

  _getFilmDuration() {
    return this._film.runtime >= MINUTES_IN_HOUR
      ? moment.utc(moment.duration(this._film.runtime, `minutes`).asMilliseconds()).format(`h[h] mm[m]`)
      : `${this._film.runtime}m`;
  }

  _getDescription() {
    return (this._film.description.length > MAX_DESCRIPTION_LENGTH)
      ? `${this._film.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
      : this._film.description;
  }

  _getButtonsMarkup() {
    return CARD_CONTROLS
      .map(([checkingClass, key, value]) => this._createButtonMarkup(checkingClass, key, value))
      .join(`\n`);
  }
}
