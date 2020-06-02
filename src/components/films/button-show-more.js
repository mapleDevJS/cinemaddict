import AbstractComponent from "../abstract-component";

export default class ButtonShowMore extends AbstractComponent {
  getTemplate() {
    return (
      `<button class="films-list__show-more">Show more</button>`
    );
  }

  setClickListener(listener) {
    this.getElement().addEventListener(`click`, listener);
  }
}
