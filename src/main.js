import API from "./api.js";
import Header from "./components/header.js";
import CommentsModel from "./models/comments";
import Films from "./components/films/films";
import FilterController from "./controllers/filter-controller";
import Loading from "./components/loading";
import Main from "./components/main";
import MoviesModel from "./models/movies";
import PageController from "./controllers/page-controller";
import Sort from "./components/sort";
import Footer from "./components/footer";
import Statistics from "./components/statistics";
import UserRank from "./components/user-rank";
import {MenuType} from "./util/filter";

const AUTHORIZATION = `Basic ldhfhdfnkwehfh7t#`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const headerComponent = new Header();
headerComponent.render(document.body);

const mainComponent = new Main();
mainComponent.render(document.body);

const userRankComponent = new UserRank(moviesModel);

const filterController = new FilterController(mainComponent.getElement(), moviesModel);
filterController.render();

const sortComponent = new Sort();
sortComponent.render(mainComponent.getElement());

const loadingComponent = new Loading();
loadingComponent.render(mainComponent.getElement());

const filmsComponent = new Films();
const pageController = new PageController(filmsComponent, sortComponent, moviesModel, commentsModel, api);

filmsComponent.render(mainComponent.getElement());

const statisticsComponent = new Statistics(moviesModel);
statisticsComponent.render(mainComponent.getElement());
statisticsComponent.hide();

api.getMovies()
  .then((movies) => {
    moviesModel.movies = movies;

    userRankComponent.render(headerComponent.getElement());

    const footerComponent = new Footer(moviesModel.movies.length);
    footerComponent.render(document.body);

    api.getComments(movies)
      .then((comments) => {
        commentsModel.comments = [].concat(...comments);

        loadingComponent.remove();
        pageController.render();
      });
  });

filterController.setOnMenuItemClick((menuItem) => {
  if (menuItem === MenuType.STATS) {
    filmsComponent.hide();
    sortComponent.hide();
    statisticsComponent.show();
  } else {
    statisticsComponent.hide();
    sortComponent.show();
    filmsComponent.show();
  }
});
