const passwordSchema = require('../models/Password');

/* On vérifie que le mot de passe valide le schéma écrit */
module.exports = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		res.writeHead(400, "Le mot de passe doit avoir au moins 8 caractères avec au moins une majuscule, au moins une minuscule, au moins un chiffre et au moins un symbole spécial.", {'content-type': 'application/json'});
		res.end('Format de mot de passe incorrect');
	} else {
		next();
	}
};