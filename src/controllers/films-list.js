import FilmsListContainer from "../components/films/films-list-container";
import FilmsListContainerController from "./films-list-container";
import ButtonShowMore from "../components/films/button-showmore";
import {QUANTITY_FILMS} from "../util/consts";
import {render, remove} from "../util/dom-util";


export default class FilmsListController {
  constructor(container) {
    this._filmsListContainerComponent = new FilmsListContainer();
    this._filmsListContainerController = new FilmsListContainerController(this._filmsListContainerComponent);
    this._buttonShowMoreComponent = new ButtonShowMore();
    this._showingTasksCount = QUANTITY_FILMS.ON_START;
    this._container = container;
  }

  render(films) {
    const onButtonShowMoreClick = () => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount = this._showingTasksCount + QUANTITY_FILMS.BY_BUTTON;

      this._filmsListContainerController.render(films.slice(prevTasksCount, this._showingTasksCount));

      if (this._showingTasksCount >= films.length) {
        remove(this._buttonShowMoreComponent);
      }
    };

    const container = this._container.getElement();

    render(container, this._filmsListContainerComponent);
    this._filmsListContainerController.render(films.slice(0, this._showingTasksCount));

    render(container, this._buttonShowMoreComponent);
    this._buttonShowMoreComponent.setClickHandler(onButtonShowMoreClick);
  }
}
