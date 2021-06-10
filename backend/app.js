/* Importation des modules */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/* Importation des modules de sécurité */
const helmet = require('helmet');
const session = require('cookie-session');

/* Déclaration des routes */
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

/* Création d'une application express*/
const app = express();

/* Module permettant de stocker des informations sensibles séparément du code */
require('dotenv').config();

/* Connection de l'app à MongoDB */
mongoose.connect(process.env.DB_URL,
	{ useNewUrlParser: true,
	  useUnifiedTopology: true })
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

/* Middleware Header pour éviter les erreurs CORS */
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

/* Middleware permettant la sécurisation des cookies */
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
app.use(session({
	name: 'sessionId',
	secret: process.env.KEY_SESSION,
	cookie: {
		secure: true,
		httpOnly: true,
		domain: 'http://localhost:3000',
		expires: expiryDate
	}
}));

/* Middleware permettant de parser les requêtes envoyées par le client. On peut y accéder grâce à req.body */
app.use(bodyParser.urlencoded({
	extended: true
}));

/* Middleware permettant de protéger l'application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée les en-têtes HTTP */
app.use(helmet());

/* Utilisation de bodyParser pour transformer les données arrivant de la requête POST en objet JSON */
app.use(bodyParser.json());

/* Middleware permettant de charger les fichiers qui sont dans le dossier "images" */
app.use('/images/', express.static(path.join(__dirname, 'images')));

/* Middlewares permettant de transmettre les requêtes vers les routes correspondantes */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

/* Exportation de l'application */
module.exports = app;