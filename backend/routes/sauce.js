/* Importation des modules */
const express = require('express');
const router = express.Router();

/* Association avec le controller */
const sauceCtrl = require('../controllers/sauce');

/* Ajout des middlewares auth et multer */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* Création des différentes routes de l'API */
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
router.get('/', auth, multer, sauceCtrl.getAllSauces);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeDislikeSauce);

/* Exportation du router */
module.exports = router;