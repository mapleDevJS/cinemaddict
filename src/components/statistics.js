import AbstractSmartComponent from "./abstract-smart-component";
import ChartData from "./chart-data";
import Chart from "chart.js";
import {getUserRank} from "./user-rank";
import {getMoviesByFilter, StatsFilterType} from "../util/filter";
import {MINUTES_IN_HOUR} from "../util/consts";

const StatsFilterNames = {
  ALL: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};

const DEFAULT_FILTER = StatsFilterType.ALL;
const SERVER_URL = `https://echo.htmlacademy.ru/`;

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this._chart = null;

    this._filter = DEFAULT_FILTER;
    this._onFilterChange();
  }

  show() {
    super.show();

    this.rerender();
  }

  rerender() {
    super.rerender();

    this._resetChart();

    this._chart = this._renderChart(this._moviesModel.getAllMovies());
  }

  recoverListeners() {
    this._onFilterChange();
  }

  getTemplate() {
    const movies = getMoviesByFilter(this._moviesModel.movies, this._filter);
    const filterMarkup = this._createFilterMarkup(this._filter);
    const watchedMovies = this._getWatchedMovies(movies);
    const watchedMoviesAmount = watchedMovies.length;
    const userRank = getUserRank(this._moviesModel.getAllMovies());
    const totalMovieDuration = this._getTotalMovieDuration(watchedMovies);
    const moviesByGenres = this._getMoviesAmountByGenre(watchedMovies);
    const topGenre = moviesByGenres.length ? moviesByGenres[0].genre : ``;

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
          <p class="statistic__item-text">${watchedMoviesAmount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalMovieDuration.hours} <span class="statistic__item-description">h</span> ${totalMovieDuration.minutes} <span class="statistic__item-description">m</span></p>
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
    return (filterName === `All time`) ? `all-time` : filterName.toLowerCase();
  }

  _createFilterMarkup(filter) {

    return Object.values(StatsFilterNames)
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
    const genres = new Set();

    movies.map((movie) => {
      return movie.genres.forEach((genre) => genres.add(genre));
    });

    return Array.from(genres);
  }

  _getMoviesAmountByGenre(movies) {
    const movieGenres = this._getMovieGenres(movies);

    return movieGenres.map((genre) => {
      return {
        genre,
        count: movies.filter((movie) => movie.genres.includes(genre)).length,
      };
    }).sort((a, b) => b.count - a.count);
  }

  _getTotalMovieDuration(movies) {
    const totalDuration = {
      hours: 0,
      minutes: 0,
    };
    const totalMovieDuration = movies.reduce((total, movie) => total + movie.runtime, 0);
    totalDuration.hours = Math.floor(totalMovieDuration / MINUTES_IN_HOUR);
    totalDuration.minutes = totalMovieDuration % MINUTES_IN_HOUR;
    return totalDuration;
  }

  _getGenresCtx() {
    return this.getElement().querySelector(`.statistic__chart`);
  }
  _renderChart(movies) {
    movies = getMoviesByFilter(movies, this._filter);
    const watchedMovies = this._getWatchedMovies(movies);
    const moviesByGenres = this._getMoviesAmountByGenre(watchedMovies);
    const genres = moviesByGenres.map((movie) => movie.genre);

    const chartData = ChartData.create(genres, moviesByGenres);

    return new Chart(this._getGenresCtx(), chartData);
  }

  _getWatchedMovies(movies) {
    return movies.filter((movie) => movie.isInHistory);
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
