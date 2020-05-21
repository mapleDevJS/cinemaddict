import UserRank from "./components/user-rank";
import Sort from "./components/sort";
import Stats from "./components/stats";
import Films from "./components/films/films";
import Statistics from "./components/statistics";
import MoviesModel from "./models/movies";
import CommentsModel from "./models/comments";
import FilterController from "./controllers/Filter-controller";
import PageController from "./controllers/page-controller";

import {generateFilms, generateComments} from "./mocks/films";
import {render} from "./util/dom-util";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const comments = generateComments();
const films = generateFilms(comments);

const moviesModel = new MoviesModel();
moviesModel.films = films;

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

render(siteHeaderElement, new UserRank(moviesModel));

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const sortComponent = new Sort();
render(siteMainElement, sortComponent);

const filmsComponent = new Films();
const pageController = new PageController(filmsComponent, sortComponent, moviesModel, commentsModel);

render(siteMainElement, filmsComponent);
pageController.render();

render(siteFooterElement, new Stats(moviesModel));

const statisticsComponent = new Statistics(moviesModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.show(moviesModel.films);
statisticsComponent.hide();

filterController.setOnMenuItemClick((menuItem) => {
  if (menuItem === `stats`) {
    pageController.hide();
    sortComponent.hide();
    statisticsComponent.show(moviesModel.films);
  } else {
    pageController.show();
    sortComponent.show();
    statisticsComponent.hide();
  }
});
