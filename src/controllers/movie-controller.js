import FilmDetails from "../components/films/film-details";
import FilmCard from "../components/films/film-card";
import {render, remove} from "../util/dom-util";

export default class MovieController {
  constructor(container) {
    this._container = container;
    this._body = document.querySelector(`body`);

  }
  render(film) {
    const filmDetailsComponent = new FilmDetails(film);
    const openPopup = () => {
      render(this._body, filmDetailsComponent);
      filmDetailsComponent.setCloseButtonClickHandler(onFilmDetailsClose);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        onFilmDetailsClose();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onFilmDetailsClose = () => {
      remove(filmDetailsComponent);
    };

    const onFilmCardElementClick = () => {
      openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    let filmCardComponent = new FilmCard(film);
    render(this._container, filmCardComponent);

    filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
    filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
    filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
  }
}
