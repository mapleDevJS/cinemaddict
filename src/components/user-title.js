import {getRandomIntInclusive} from "../util/util";
import Abstract from "./abstract";

const ProfileRank = {
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

export default class UserTitle extends Abstract {
  _getProfileRank() {
    const rank = getRandomIntInclusive(0, 30);

    switch (true) {
      case (rank >= ProfileRank.NOVICE.from && rank <= ProfileRank.FUN.from - 1):
        return ProfileRank.NOVICE.rank;

      case (rank >= ProfileRank.FUN.from && rank <= ProfileRank.MOVIE_BUFF.from - 1):
        return ProfileRank.FUN.rank;

      case (rank >= ProfileRank.MOVIE_BUFF.from):
        return ProfileRank.MOVIE_BUFF.rank;

      default:
        return (``);
    }
  }

  getTemplate() {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${this._getProfileRank()}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}

