
import {render, remove} from "../util/dom-util";
import FilmCard from "../components/films/film-card";
import FilmDetails from "../components/films/film-details";

export default class FilmsListContainerController {
  constructor(container) {
    this._container = container;
    this._body = document.querySelector(`body`);
  }

  render(films) {
    const container = this._container.getElement();

    films.forEach((film) => {
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
      render(container, filmCardComponent);
      filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
      filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
      filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
    });
  }
}
