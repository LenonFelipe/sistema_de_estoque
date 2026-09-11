export default (error, req, res, next) => {
  console.error(error);

  return res.status(400).json({
    error: error.message || 'Erro interno'
  });
};