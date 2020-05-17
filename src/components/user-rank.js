import Abstract from "./abstract";

const UserRating = {
  NOVICE: {
    rank: `Novice`,
    from: 1,
  },
  FUN: {
    rank: `Fan`,
    from: 11
  },
  MOVIE_BUFF: {
    rank: `Movie Buff`,
    from: 21
  }
};

export default class UserRank extends Abstract {
  constructor(moviesModel) {
    super();
    this._films = moviesModel.films;
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${this._getUserRank()}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }

  _getUserRank() {
    const rank = this._films.reduce((acc, film) => {
      if (film.isInHistory) {
        acc++;
      }
      return acc;
    }, 0);

    switch (true) {
      case (rank >= UserRating.NOVICE.from && rank <= UserRating.FUN.from - 1):
        return UserRating.NOVICE.rank;

      case (rank >= UserRating.FUN.from && rank <= UserRating.MOVIE_BUFF.from - 1):
        return UserRating.FUN.rank;

      case (rank >= UserRating.MOVIE_BUFF.from):
        return UserRating.MOVIE_BUFF.rank;

      default:
        return (``);
    }
  }
}

