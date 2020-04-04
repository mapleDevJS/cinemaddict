import {createUserTitle} from "./components/user-title.js";
import {createSiteMenu} from "./components/menu.js";
import {createSiteSort} from "./components/sort.js";
import {createFilmList} from "./components/film-list.js";
import {createFilmStats} from "./components/stats.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createUserTitle());
render(siteMainElement, createSiteMenu());
render(siteMainElement, createSiteSort());
render(siteMainElement, createFilmList());
render(siteFooterElement, createFilmStats());
