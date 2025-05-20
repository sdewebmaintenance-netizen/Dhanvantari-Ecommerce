function checkId(req, res, next) {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || id <= 0) {
    res.status(404);
    throw new Error(`Invalid ID: ${req.params.id}`);
  }

  next();
}

module.exports = checkId;
