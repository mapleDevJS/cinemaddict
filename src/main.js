import CommentsModel from "./models/comments";
import Films from "./components/films/films";
import FilterController from "./controllers/filter-controller";
import MoviesModel from "./models/movies";
import PageController from "./controllers/page-controller";
import Sort from "./components/sort";
import Stats from "./components/stats";
import Statistics from "./components/statistics";
import UserRank from "./components/user-rank";

import {generateFilms, generateComments} from "./mocks/films";
import {render} from "./util/dom-util";

const comments = generateComments();
const films = generateFilms(comments);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

moviesModel.films = films;
commentsModel.comments = comments;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

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
