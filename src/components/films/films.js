import AbstractComponent from "../abstract-component";

export default class Films extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="films"></section>`
    );
  }
}
