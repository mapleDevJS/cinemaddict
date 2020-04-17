export const createFilmStats = (films) => {
  const total = films.length;
  return (
    `<p>${total} movies inside</p>`
  );
};
