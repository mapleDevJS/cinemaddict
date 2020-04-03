import {createUserTitle} from "./components/user-title.js";
import {createSiteMenu} from "./components/menu.js";
import {createSiteSort} from "./components/sort.js";
import {createFilms} from "./components/films.js";
import {createFilmCard} from "./components/filmcard.js";
import {createButtonShowMore} from "./components/button-show-more.js";
import {createFilmExtra} from "./components/film-extra.js";
import {createFilmStats} from "./components/stats.js";

const FILM_COUNT = 5;
const FILM_EXTRA_SECTION_COUNT = 2;
const FILM_EXTRA_COUNT = 2;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createUserTitle());
render(siteMainElement, createSiteMenu());
render(siteMainElement, createSiteSort());
render(siteMainElement, createFilms());

const filmsElement = siteMainElement.querySelector(`.films`);
let filmListContainer = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainer, createFilmCard());
}

render(filmsElement, createButtonShowMore());

for (let i = 0; i < FILM_EXTRA_SECTION_COUNT; i++) {
  render(filmListContainer, createFilmExtra());
}

const filmExtraElementList = filmsElement.querySelectorAll(`.films-list--extra`);

for (let i = 0; i < filmExtraElementList.length; i++) {
  filmListContainer = filmExtraElementList[i].querySelector(`.films-list__container`);
  console.log(filmListContainer);
  for (let j = 0; j < FILM_EXTRA_COUNT; j++) {
    render(filmListContainer, createFilmCard());
  }
}

render(siteFooterElement, createFilmStats());
