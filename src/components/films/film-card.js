import {pluralize, getFullDate} from "../../util/util";
import Abstract from "../abstract";

const CARD_CONTROLS = new Map([
  [`isInWatchlist`, `add-to-watchlist`, `Add to watchlist`],
  [`isInHistory`, `mark-as-watched`, `Mark as watched`],
  [`isInFavorites`, `favorite`, `Mark as favorite`]
]);

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
  }

  _getActiveClass(checkingClass) {
    return this._film[checkingClass] ? `film-card__controls-item--active` : ``;
  }

  _getButton(checkingClass, key, value) {
    return (
      `<button
        class="
          film-card__controls-item
          button
          film-card__controls-item--${key} ${this._getActiveClass(checkingClass)}
        "
        ${value}
      >`
    );
  }

  _getButtonsMarkup() {
    return [...CARD_CONTROLS.entries()]
      .map(([checkingClass, value, key]) => this._getButton(checkingClass, value, key))
      .join(`\n`);
  }

  getTemplate() {
    return (
      `<article class="film-card">
        <h3 class="film-card__title">${this._film.title}</h3>
        <p class="film-card__rating">${this._film.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getFullDate(this._film.release)}</span>
          <span class="film-card__duration">${this._film.runtime}</span>
          <span class="film-card__genre">${this._film.genres.shift()}</span>
        </p>
        <img src="./images/posters/${this._film.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._film.description}</p>
        <a class="film-card__comments">${this._film.comments.length} ${pluralize(this._film.comments.length, [`Comment`, `Comments`])}</a>
        <form class="film-card__controls">
          ${this._getButtonsMarkup()}
        </form>
      </article>`
    );
  }

  setPosterClickListener(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setTitleClickListener(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCommentsClickListener(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistClickListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setAddToFavouriteClickListener(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
