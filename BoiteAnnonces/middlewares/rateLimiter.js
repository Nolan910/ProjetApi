const setRateLimit = require("express-rate-limit");

const rateLimitMiddleware = setRateLimit({
    windowMs: 1000,
    max: 10,
    message: "Vous ne pouvez pas réaliser plus de 10 requêtes par seconde",
    headers: true,
});

module.exports = rateLimitMiddleware;