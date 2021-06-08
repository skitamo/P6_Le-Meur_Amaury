/* Importation des modules */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* Création du schémas de données */
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

/* Plugin pour rendre l'email utilisateur unique */
userSchema.plugin(uniqueValidator);

/* Exportation du schéma de données */
module.exports = mongoose.model('User', userSchema); 