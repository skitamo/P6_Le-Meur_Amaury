/* Importation des modules */
const express = require('express');

/* Création du router */
const router = express.Router();

/* Association avec le controller */
const userCtrl = require('../controllers/user');

/* Ajout du format de mot de passe attendu */
const validatePassword = require('../middleware/validatePassword');

/* Création des différentes routes de l'API */
router.post('/signup', validatePassword, userCtrl.signup);
router.post('/login', userCtrl.login);

/* Exportation du router */
module.exports = router;