var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/user');
var FriendRequest = require('../models/friendRequest');

var movimiento = "stop";

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index');
});

router.get('/movimiento', function(req, res, next){
  res.send(movimiento);
});

router.post('/movimiento/:direccion', function(req, res, next){
  movimiento = req.params.direccion;
  console.log(req.params.direccion);
});

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
    //req.flash('error_msg', 'No has iniciado sesion');
    res.redirect(302, '/login');
  }
}

module.exports = router;