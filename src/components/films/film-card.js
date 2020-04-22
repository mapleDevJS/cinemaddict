import {createElement} from "../../util/dom-util";
import {getPlurals} from "../../util/util";

const CARD_CONTROLS = new Map([
  [`add-to-watchlist`, `Add to watchlist`],
  [`mark-as-watched`, `Mark as watched`],
  [`favorite`, `Mark as favorite`]
]
);

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  _getButtons() {
    let markup = ``;
    CARD_CONTROLS.forEach((value, key) => {
      markup += `<button class="film-card__controls-item button film-card__controls-item--${key}">${value}</button>`;
    });
    return markup;
  }

  getTemplate() {
    return (
      `<article class="film-card">
        <h3 class="film-card__title">${this._film.title}</h3>
        <p class="film-card__rating">${this._film.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${this._film.release.getFullYear()}</span>
          <span class="film-card__duration">${this._film.runtime}</span>
          <span class="film-card__genre">${this._film.genres.shift()}</span>
        </p>
        <img src="./images/posters/${this._film.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._film.description}</p>
        <a class="film-card__comments">${this._film.comments.length} ${getPlurals(this._film.comments.length, [`Comment`, `Comments`])}</a>
        <form class="film-card__controls">
          ${this._getButtons()}
        </form>
      </article>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
