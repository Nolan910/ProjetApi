const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Non authentifié'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Token invalide'
            });
        }

        User.findById(decoded.userId)
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: 'Utilisateur non trouvé'
                    });
                }
                req.user = user;
                next();
            })
            .catch(() => res.status(500).json({
                message: 'Erreur serveur'
            }));
    });
};

module.exports = authMiddleware;