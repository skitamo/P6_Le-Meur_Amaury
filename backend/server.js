const http = require('http');
const app = require('./app'); /* On appelle l'application */

app.set('port', process.env.PORT || 3000); /* On définit sur quel port l'application doit tourner */
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);