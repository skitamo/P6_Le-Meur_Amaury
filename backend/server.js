const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const options = {
	key: fs.readFileSync('selfsigned.key'),
	cert: fs.readFileSync('selfsigned.crt')
};

var app = express();

const server = https.createServer((req, res) => {
	res.end('Voilà la réponse du serveur !');
});

server.listen(process.env.PORT || 3000);