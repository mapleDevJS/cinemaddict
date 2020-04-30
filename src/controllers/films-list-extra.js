import {render} from "../util/dom-util";
import FilmsListContainer from "../components/films/films-list-container";
import FilmsListContainerController from "./films-list-container";

export default class FilmsListExtraController {
  constructor(container) {
    this._container = container;
  }

  render(films) {
    const filmsListContainerComponent = new FilmsListContainer();
    const filmsListContainerController = new FilmsListContainerController(filmsListContainerComponent);

    const container = this._container.getElement();

    render(container, filmsListContainerComponent);
    filmsListContainerController.render(films);
  }
}
