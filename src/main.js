import {createUserTitle} from "./components/user-title";
import {createSiteMenu} from "./components/menu";
import {createSiteSort} from "./components/sort";
import {createFilmList} from "./components/film-list";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createFilmStats} from "./components/stats";
import {generateFilms} from "./mocks/films";
import {createFilmCard} from "./components/film-card";
import {addListenerOnShowMoreButton} from "./components/button-showmore";
import {render} from "./util/util";

const QUANTITY_FILMS = {
  TOTAL: 17,
  ON_START: 5,
  BY_BUTTON: 5
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// const render = (container, template, place = `beforeend`) => {
//   container.insertAdjacentHTML(place, template);
// };

const createFilmCards = (start, end) => {
  let markup = ``;
  for (let i = start; i < end; i++) {
    markup += createFilmCard(films[i]);
  }
  return markup;
};

const renderFilmCards = () => {
  const container = document.querySelector(`.films-list__container`);
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount += QUANTITY_FILMS.BY_BUTTON;
  if (showingFilmsCount > films.length) {
    showingFilmsCount = films.length;
    document.querySelector(`.films-list__show-more`).remove();
  }
  render(container, createFilmCards(prevFilmsCount, showingFilmsCount));
};

let showingFilmsCount = QUANTITY_FILMS.ON_START;
const films = generateFilms(QUANTITY_FILMS.TOTAL);

render(siteHeaderElement, createUserTitle(films));
render(siteMainElement, createSiteMenu(films));
render(siteMainElement, createSiteSort());
render(siteMainElement, createFilmList(films, createFilmCards(0, QUANTITY_FILMS.ON_START)));
render(siteFooterElement, createFilmStats(films));
// render(siteFooterElement, createFilmDetailsTemplate(films[0], 0), `afterend`);
addListenerOnShowMoreButton(renderFilmCards);
