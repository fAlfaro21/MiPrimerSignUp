const route = require('express').Router();

const userCollectionRoutes = require('./userCollection');

// Middleware para el enrutado de userCollection
route.use('/userCollection', userCollectionRoutes);

module.exports = route;