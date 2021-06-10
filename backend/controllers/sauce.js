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
	.catch(error => res.status(400).json({ error }));
};

/* Route PUT pour modifier une sauce et la renvoyer dans la base de données */
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ?
	{
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch(error => res.status(400).json({ error }));
};

/* Route DELETE pour supprimer une sauce de la base de données */
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
				.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};

/* Route GET pour afficher toutes les sauces de la base de donnée */
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};