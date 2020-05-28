import AbstractSmart from "./abstract-smart";
import {getUserRank} from "./user-rank";
import ChartData from "./chart-data";
import Chart from "chart.js";
import {getMoviesByFilter} from "../util/filter";

const filterNames = [`All time`, `Today`, `Week`, `Month`, `Year`];
const DEFAULT_FILTER = `all-time`;
const SERVER_URL = `https://echo.htmlacademy.ru/`;

export default class Statistics extends AbstractSmart {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    // this._films = moviesModel.movies;
    this._chart = null;
    // this.renderChart(this._films);
    this._filter = DEFAULT_FILTER;
    this._onFilterChange();
  }

  getTemplate() {
    const movies = getMoviesByFilter(this._moviesModel.movies, this._filter);
    const filterMarkup = this._createFilterMarkup(this._filter);
    const watchedFilmsAmount = movies.length;
    const userRank = getUserRank(movies);
    const watchedMovies = movies.filter((movie) => movie.isInHistory);
    const totalFilmDuration = this._getTotalFilmDuration(watchedMovies);
    const filmsByGenres = this._getFilmsAmountByGenre(movies);
    const topGenre = movies.length ? filmsByGenres[0].genre : ``;

    return (
      `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>
      <form action="${SERVER_URL}" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filterMarkup}
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsAmount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalFilmDuration.hours} <span class="statistic__item-description">h</span> ${totalFilmDuration.minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
    );
  }

  _getFilterIdByName(filterName) {
    let filterId = ``;
    filterId = (filterName === `All time`) ? `all-time` : filterName.toLowerCase();

    return filterId;
  }

  _createFilterMarkup(filter) {
    return filterNames
    .map((name) => {
      return (
        `<input type="radio"
          class="statistic__filters-input visually-hidden"
          name="statistic-filter"
          id="statistic-${this._getFilterIdByName(name)}"
          value="${this._getFilterIdByName(name)}" ${this._getFilterIdByName(name) === filter ? `checked` : ``}
        >
        <label for="statistic-${this._getFilterIdByName(name)}" class="statistic__filters-label">
          ${name}
        </label>`
      );
    })
    .join(`\n`);
  }

  _getMovieGenres(movies) {
    return movies.reduce((movieGenres, film) => {
      film.genres.forEach((it) => {
        if (!movieGenres.includes(it)) {
          movieGenres.push(it);
        }
      });
      return movieGenres;
    }, []);
  }

  _getmoviesAmountByGenre(movies) {
    const movieGenres = this._getMovieGenres(movies);

    return movieGenres.map((genre) => {
      return {
        genre,
        count: movies.filter((movie) => movie.genres.includes(genre)).length,
      };
    }).sort((a, b) => b.count - a.count);
  }

  _getTotalMovieDuration(movies) {
    let totalDuration = {
      hours: 0,
      minutes: 0,
    };
    const totalMovieDuration = movies.reduce((total, movie) => total + movie.runtime, 0);
    totalDuration.hours = Math.floor(totalMovieDuration / 60);
    totalDuration.minutes = totalMovieDuration % 60;
    return totalDuration;
  }

  _getGenresCtx() {
    return this.getElement().querySelector(`.statistic__chart`);
  }

  _renderChart(movies) {
    const filteredMovies = getMoviesByFilter(movies, this._filter);
    const moviesByGenres = this._getMoviesAmountByGenre(filteredMovies);
    const genres = moviesByGenres.map((movie) => movie.genre);

    const chartData = ChartData.create(genres, moviesByGenres);

    return new Chart(this._getGenresCtx(), chartData);
  }

  show() {
    super.show();

    this.rerender();
  }

  recoverListeners() {
    this._onFilterChange();
  }

  rerender() {
    super.rerender();

    this._resetChart();

    this._chart = this._renderChart(this._moviesModel.movies);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _onFilterChange() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
  }
}
