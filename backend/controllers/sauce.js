/* Importation des modules */
const Sauce = require('../models/Sauce');
const fs = require('fs');

/* Route POST pour pouvoir ajouter une sauce à la base de données */
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: []
	});
	sauce.save()
	.then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
	.catch(error => res.status(400).json({ error }))
};