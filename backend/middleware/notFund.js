export const notFound = (req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
};
