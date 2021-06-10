/* Importation des modules */
const mongoose = require('mongoose');

/* Création du schéma de données */
const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, required: true },
	dislikes: { type: Number, required: true },
	usersLiked: { type: [String] },
	usersDisliked: { type: [String] },
});

/* Exportation du schéma de données */
module.exports = mongoose.model('Sauce', sauceSchema);