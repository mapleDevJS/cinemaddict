import UserTitle from "./components/user-title";
import Filter from "./components/filter";
import Sort from "./components/sort";
import Stats from "./components/stats";
import Films from "./components/films/films";
import MoviesModel from "./models/movies";
import {generateFilms} from "./mocks/films";
import {render} from "./util/dom-util";
import {QUANTITY_FILMS} from "./util/consts";
import PageController from "./controllers/page-controller";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(QUANTITY_FILMS.TOTAL);

const moviesModel = new MoviesModel();
moviesModel.films = films;

render(siteHeaderElement, new UserTitle(films));
render(siteMainElement, new Filter(films));

const sortComponent = new Sort();
render(siteMainElement, sortComponent);

const filmsComponent = new Films();
const pageController = new PageController(filmsComponent, sortComponent, moviesModel);

render(siteMainElement, filmsComponent);
pageController.render();

render(siteFooterElement, new Stats(films));
