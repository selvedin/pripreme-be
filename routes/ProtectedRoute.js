const express = require('express')
const ProtectedRoute = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const { modelName } = require('../models/User')


ProtectedRoute.use((req, res, next) => {

  // check header for the token
  var token = req.headers['x-auth-token'];

  // decode token
  if (token) {

    // verifies secret and checks if the token is expired
    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Morate biti prijavljeni' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token  

    res.status(401).send({ msg: 'Nemate dozvolu za prisup ovom dijelu aplikacije' });

  }
})

module.exports = ProtectedRoute