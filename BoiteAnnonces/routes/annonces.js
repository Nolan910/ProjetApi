const express = require('express');
const router = express.Router();
const Annonce = require('./models/annonce');
const authMiddleware = require('./middlewares/authMiddleware');
const rateLimiter = require('./middlewares/rateLimiter');

//créer une annonce
router.post('/', authMiddleware, rateLimiter, (req, res) => {
    const { title, description, imageUrl } = req.body;
    const annonce = new Annonce({ title, description, imageUrl, user: req.user._id });
    annonce.save()
        .then(ann => res.status(200).json(ann))
        .catch(err => res.status(401).json({message: 'l\'annonce n\'a pas pu être publier'}));
});

//modifier une annonce 
router.put('/:id', authMiddleware, (req, res) => {
    const { id } = req.params; //lecture de l'id rajouter par mongodb
    const { title, description, imageUrl } = req.body; //nouvelles données de l'annonce

    // Vérification si l'annonce existe
    Annonce.findById(id)
        .then(annonce => {
            if (!annonce) {
                return res.status(404).json({message: 'L\'annonce n\'existe pas'});
            }

            // Vérification propriétaire de l'annonce
            if (annonce.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({message: 'Vous n\'êtes pas le propriétaire de l\'annonce'});
            }

            annonce.title = title || annonce.title;
            annonce.description = description || annonce.description;
            annonce.imageUrl = imageUrl || annonce.imageUrl;

            return annonce.save();
        })
        .then(updatedAnnonce => {
            res.status(200).json(updatedAnnonce);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Erreur serveur lors de la mise à jour de l\'annonce'});
        });
});

module.exports = router;