const testMiddleware = (req, res, next) => {
  console.log("anjir work middleware");

  next();
};

export default testMiddleware;
