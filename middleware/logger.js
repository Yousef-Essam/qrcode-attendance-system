const logger = (req, res, next) => {
    console.log(`A ${req.method} request is made on ${req.path}`);
    next();
}

module.exports = logger;