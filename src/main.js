import UserTitle from "./components/user-title";
import Menu from "./components/menu";
import Sort from "./components/sort";
import Stats from "./components/stats";
import FilmList from "./components/films/film-list";
import FilmListExtra from "./components/films/film-list-extra";
import FilmCard from "./components/films/film-card";
import NoFilms from "./components/films/no-films";
import ButtonShowMore from "./components/films/button-showmore";
import {generateFilms} from "./mocks/films";
import {sortArrayOfObjectsByKey} from "./util/util";
import {render} from "./util/dom-util";
import FilmDetails from "./components/films/film-details";

const QUANTITY_FILMS = {
  TOTAL: 17,
  ON_START: 5,
  BY_BUTTON: 5
};

const SECTION_NAMES = new Map([
  [`rating`, `Top Rated`],
  [`comments`, `Most commented`]
]);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const renderFilmCard = (filmListContainer, film) => {
  const bodyElement = document.querySelector(`body`);


  const openPopup = () => {
    bodyElement.appendChild(fimlDetailsCardComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      onFilmDetailsClose();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onFilmCardElementClick = () => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  };


  const filmCardComponent = new FilmCard(film);
  const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  poster.addEventListener(`click`, onFilmCardElementClick);

  const title = filmCardComponent.getElement().querySelector(`.film-card__title`);
  title.addEventListener(`click`, onFilmCardElementClick);

  const comments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  comments.addEventListener(`click`, onFilmCardElementClick);

  const fimlDetailsCardComponent = new FilmDetails(film);
  const closeButton = fimlDetailsCardComponent.getElement().querySelector(`.film-details__close-btn`);

  const onFilmDetailsClose = () => {
    bodyElement.removeChild(fimlDetailsCardComponent.getElement());
  };

  closeButton.addEventListener(`click`, onFilmDetailsClose);

  render(filmListContainer, filmCardComponent);
};

const renderFilmList = (filmListComponent) => {
  const filmListElement = filmListComponent.getElement().querySelector(`.films-list`);
  if (films.length === 0) {
    render(filmListElement, new NoFilms());
    return;
  }

  const filmListContainer = filmListComponent.getElement().querySelector(`.films-list__container`);

  let showingTasksCount = QUANTITY_FILMS.ON_START;
  films.slice(0, showingTasksCount)
    .forEach((film) => {
      renderFilmCard(filmListContainer, film);
    });

  const buttonShowMoreComponent = new ButtonShowMore();
  render(filmListElement, buttonShowMoreComponent);

  const onShowMoreButtonClick = () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + QUANTITY_FILMS.BY_BUTTON;

    films.slice(prevTasksCount, showingTasksCount)
      .forEach((film) => renderFilmCard(filmListContainer, film));

    if (showingTasksCount >= films.length) {
      buttonShowMoreComponent.getElement().remove();
      buttonShowMoreComponent.removeElement();
    }
  };

  buttonShowMoreComponent.getElement().addEventListener(`click`, onShowMoreButtonClick);
};

const films = generateFilms(QUANTITY_FILMS.TOTAL);

render(siteHeaderElement, new UserTitle());
render(siteMainElement, new Menu(films));
render(siteMainElement, new Sort());

const filmListComponent = new FilmList(films);
render(siteMainElement, filmListComponent);

renderFilmList(filmListComponent);

const getTopFilms = (key) => {
  return films.sort(sortArrayOfObjectsByKey(key)).slice(0, 2);
};

const renderFilmExtraSections = () => {
  SECTION_NAMES.forEach((name, key) => {
    const filmListExtraComponent = new FilmListExtra(name);
    render(siteMainElement.querySelector(`.films`), filmListExtraComponent);

    const filmListContainer = filmListExtraComponent.getElement().querySelector(`.films-list__container`);
    getTopFilms(key).forEach((film) => renderFilmCard(filmListContainer, film));
  }
  );
};

renderFilmExtraSections();
render(siteFooterElement, new Stats(films));
