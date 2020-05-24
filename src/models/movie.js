export default class Movie {
  constructor(data) {
    const filmInfo = data.film_info;
    const userDetails = data.user_details;

    this.id = data.id;
    this.title = filmInfo.title;
    this.original = filmInfo.alternative_title;
    this.rating = filmInfo.total_rating;
    this.poster = filmInfo.poster;
    this.age = filmInfo.age_rating;
    this.director = filmInfo.director;
    this.writers = filmInfo.writers;
    this.actors = filmInfo.actors;
    this.release = filmInfo.release.date;
    this.country = filmInfo.release.release_country;
    this.runtime = filmInfo.runtime;
    this.genres = filmInfo.genre;
    this.description = filmInfo.description;
    this.comments = data.comments;
    this.isInWatchlist = userDetails.watchlist;
    this.isInHistory = userDetails.already_watched;
    this.isInFavorite = userDetails.favorite;
    this.watchingDate = userDetails.watching_date;
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    // console.log(data);
    return data.map(Movie.parseMovie);
  }
}
