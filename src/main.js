import API from "./api.js";
import CommentsModel from "./models/comments";
import Films from "./components/films/films";
import FilterController from "./controllers/filter-controller";
import MoviesModel from "./models/movies";
import PageController from "./controllers/page-controller";
import Sort from "./components/sort";
import Footer from "./components/footer";
import Statistics from "./components/statistics";
import UserRank from "./components/user-rank";

import {render} from "./util/dom-util";

const AUTHORIZATION = `Basic 10o37Jfjb2iu47yerhM#)`;

const api = new API(AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();



const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);



const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const sortComponent = new Sort();
render(siteMainElement, sortComponent);

const filmsComponent = new Films();
const pageController = new PageController(filmsComponent, sortComponent, moviesModel, commentsModel);

render(siteMainElement, filmsComponent);




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

api.getFilms()
  .then((films, comments) => {
    moviesModel.films = films;
    commentsModel.comments = comments;
    pageController.render();
    render(siteHeaderElement, new UserRank(moviesModel));
    render(siteFooterElement, new Footer(moviesModel));
  });
