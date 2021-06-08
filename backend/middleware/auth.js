/* Importation des modules */
const jwt = require('jsonwebtoken');

/* Module permettant de stocker des informations sensibles séparément du code */
require('dotenv').config();

/* Création et exportation du middleware auth */
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw 'User ID non valable !';
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | 'Requête non authentifiée !'});
	};
};