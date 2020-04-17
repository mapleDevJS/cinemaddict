export const createButtonShowMore = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export const addListenerOnShowMoreButton = (cb) =>
  document.querySelector(`.films-list__show-more`).addEventListener(`click`, cb);
