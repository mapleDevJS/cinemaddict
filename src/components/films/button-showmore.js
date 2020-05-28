import Abstract from "../abstract";

export default class ButtonShowMore extends Abstract {
  getTemplate() {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  }

  setClickListener(listener) {
    this.getElement().addEventListener(`click`, listener);
  }
}
