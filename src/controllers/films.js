import NoFilms from "../components/films/no-films";
import FilmsList from "../components/films/films-list";
import FilmsListController from "../controllers/films-list";
import FilmsListExtra from "../components/films/films-list-extra";
import FilmsListExtraController from "../controllers/films-list-extra";
import {sortArrayOfObjectsByKey} from "../util/util";
import {render} from "../util/dom-util";

const SECTION_NAMES = new Map([
  [`rating`, `Top Rated`],
  [`comments`, `Most commented`]
]);

export default class FilmsController {
  constructor(container) {
    this._noFilmsComponent = new NoFilms();
    this._container = container;
  }

  _getTopFilms(films, key) {
    return films.sort(sortArrayOfObjectsByKey(key)).slice(0, 2);
  }

  _renderFilmExtraSections(container, films) {
    SECTION_NAMES.forEach((name, key) => {
      const filmsListExtraComponent = new FilmsListExtra(name);
      const filmsListExtraController = new FilmsListExtraController(filmsListExtraComponent);
      render(container, filmsListExtraComponent);
      const topFilms = this._getTopFilms(films, key);
      filmsListExtraController.render(topFilms);
    });
  }

  render(films) {
    const container = this._container.getElement();
    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      this._renderFilmExtraSections(container, films);
      return;
    }

    const filmsListComponent = new FilmsList();
    const filmsListController = new FilmsListController(filmsListComponent);

    render(container, filmsListComponent);
    filmsListController.render(films);

    this._renderFilmExtraSections(container, films);
  }
}
