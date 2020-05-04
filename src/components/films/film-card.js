import {pluralize, getFullDate} from "../../util/util";
import Abstract from "../abstract";

const CARD_CONTROLS = new Map([
  [`add-to-watchlist`, `Add to watchlist`],
  [`mark-as-watched`, `Mark as watched`],
  [`favorite`, `Mark as favorite`]
]);

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
  }

  _getButton(key, value) {
    return `<button class="film-card__controls-item button film-card__controls-item--${key}">${value}</button>`;
  }

  _getButtonsMarkup() {
    return [...CARD_CONTROLS.entries()]
      .map(([value, key]) => this._getButton(value, key))
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

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setAddToFavouriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
