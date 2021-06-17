/* Importation des modules */
const Sauce = require('../models/Sauce');
const fs = require('fs');

/* Route POST pour pouvoir ajouter une sauce à la base de données */
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	Sauce.findOne({ name:sauceObject.name })
		.then(sauce => {
			if (!sauce) {
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
			}
			else {console.log('Sauce déjà existante !')} 
		})
		.catch(error => res.status(404).json({ error }));
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

/* Route GET pour afficher toutes les sauces de la base de données */
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

/* Route GET pour afficher une seule sauce de la base de données */
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }));
};

/* Route POST pour like/dislike une sauce */
exports.likeDislikeSauce = (req, res, next) => {
	let like = req.body.like

		if (like === 1) {
			Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId },
				$inc: { likes: +1}, _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Vous avez liké cette sauce !'}))
				.catch((error) => res.status(400).json({ error }))
		}

		if (like === -1) {
			Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId },
				$inc : { dislikes: +1}, _id: req.params.id })
				.then(() => res.status(200).json({ message: 'Vous avez disliké cette sauce !'}))
				.catch((error) => res.status(400).json({ error }))
		}

		if (like === 0) {
			Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne({ _id: req.params.id}, { $pull: { usersLiked: req.body.userId },
						$inc: { likes: -1}, _id: req.params.id })
						.then(() => res.status(200).json({ message: 'Vous ne likez plus cette sauce !'}))
						.catch((error) => res.status(400).json({ error }))
				}

				if (sauce.usersDisliked.includes(req.body.userId)) {
					Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId },
						$inc: { dislikes: -1}, _id: req.params.id })
						.then(() => res.status(200).json({ message: 'Vous ne dislikez plus cette sauce !'}))
						.catch((error) => res.status(400).json({ error }))
				}
			})
			.catch((error) => res.status(404).json({ error }))
		}
}