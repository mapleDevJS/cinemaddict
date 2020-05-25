import API from "./api.js";
import CommentsModel from "./models/comments";
import Films from "./components/films/films";
import FilterController from "./controllers/filter-controller";
import Loading from "./components/loading";
import MoviesModel from "./models/movies";
import PageController from "./controllers/page-controller";
import Sort from "./components/sort";
import Footer from "./components/footer";
import Statistics from "./components/statistics";
import UserRank from "./components/user-rank";

import {render, remove} from "./util/dom-util";

const AUTHORIZATION = `Basic 10o37Jfjb2iu47yerhM#`;
const api = new API(AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, new UserRank(moviesModel));

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const sortComponent = new Sort();
render(siteMainElement, sortComponent);

const loadingComponent = new Loading();
render(siteMainElement, loadingComponent);

const filmsComponent = new Films();
const pageController = new PageController(filmsComponent, sortComponent, moviesModel, commentsModel);

render(siteMainElement, filmsComponent);

const statisticsComponent = new Statistics(moviesModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

api.getFilms()
  .then((films) => {
    moviesModel.films = films;

    api.getComments(films)
      .then((comments) => {
        commentsModel.comments = [].concat(...comments);
        pageController.render();
        render(siteFooterElement, new Footer(moviesModel));
        remove(loadingComponent);
      });
  });

filterController.setOnMenuItemClick((menuItem) => {
  if (menuItem === `stats`) {
    pageController.hide();
    sortComponent.hide();
    statisticsComponent.show();
  } else {
    statisticsComponent.hide();
    sortComponent.show();
    pageController.show();
  }
});
