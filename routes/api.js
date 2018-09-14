var express = require('express');
var router = express.Router();

var User = require('../models/user');
var FriendRequest = require('../models/friendRequest');

router.get('/friends', function(req,res,next){
    res.send({friends: req.user.friends});
});

router.get('/friends/requests', function(req,res,next){
    FriendRequest.find(function(err, results){
        res.send(results);
    });
});

router.post('/friends/sendReq/:id', function(req,res,next){
  var idFrom = req.user._id;
  var idTo = req.params.id;
  FriendRequest.newFR(idFrom, idTo, function(err, fr){ 
    if (err)
        res.send(err);
    else  
        res.send(fr);
  });
});

router.put('/friends/acceptReq/:id', function(req,res,next){
  var idTo = req.user._id;
  var idFrom = req.params.id;
  FriendRequest.acceptFR(idFrom, idTo, function(err, fr){
    if (err) 
      res.send(err);
    else  
      res.send(fr);
  });
});

router.delete('/friends/declineReq/:id', function(req,res,next){
  var idTo = req.user._id;
  var idFrom = req.params.id;
  FriendRequest.declineFR(idFrom, idTo, function(err){
    if(err)
      res.send(err);
    else  
      res.send('Solicitud rechazada correctamente.');
  });
});

router.get('/search/:query', function(req, res, next){
    var busqueda = req.params.query;
    var user = req.user;
    busqueda = busqueda.toLowerCase().replace(/\s/g, '');
    User.find(function(err, usuarios){
      FriendRequest.find(function(err, friendRequests){
        var resultados = []; 
        for (var i = 0; i<usuarios.length; i++){
          var nombre = (usuarios[i].nombre + usuarios[i].apellido).toLowerCase().replace(/\s/g, '');
          if (nombre.indexOf(busqueda) !== -1){
            var request = getRequestStatus(usuarios[i]._id, user.friends, friendRequests);
            resultados.push({_id:usuarios[i]._id, 
              nombre:usuarios[i].nombre, 
              apellido:usuarios[i].apellido,
              request:request
            });
          }
        }
        res.send({
          user:{
            _id:req.user._id,
            nombre:req.user.nombre,
            apellido:req.user.apellido
          },
          resultados:resultados});
  
      });
    });
  });
  
  function getRequestStatus(id, friends, friendRequests){
    for (var i = 0; i<friends.length; i++){
      
      if (friends[i]._id == id){
        console.log(friends[i]);
        return 'friend';
      }
        
    }
    for (var i = 0; i<friendRequests.length; i++){
      if (friendRequests[i].from == id)
        return 'received';
      if (friendRequests[i].to == id)
        return 'sent';
    }
    return 'none';
  }
  
  module.exports = router;