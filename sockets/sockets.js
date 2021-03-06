module.exports = function(app, server){
    var io = require('socket.io')(server);
    var User = require('../models/user');

    io.on('connection', function(socket){

        socket.on('movimiento', function(data){
            var socketRobot;
            ///var socketRobot = getRobotSocket(data.id);   
            for (let i = 0; i < app.locals.connections.length; i++) {
                const element = app.locals.connections[i];
                if (element.socketUser === socket.id)
                    socketRobot = app.locals.connections[i].socketRobot;
            }         
            if (socketRobot !== undefined)
                io.to(`${socketRobot}`).emit('movimiento', data.movimiento);
        });

        socket.on('sensores', function(data){
            for (var i = 0; i<app.locals.users; i++){
                io.to(`${app.locals.users[i].socket}`).emit('sensores', data);
            }
        });

        socket.on('request-sensores', function(data){
            for (var i = 0; i<app.locals.robots; i++){
                io.to(`${app.locals.robots[i].socket}`).emit('sensores', data);
            }
        });

        socket.on('arduino-connection', function(data){
            console.log('Arduino connected. (MAC: '+data.mac+')');
            app.locals.robots.push({mac:data.mac, socket:socket.id});
            io.emit('robot-connection', data.mac);
        });

        socket.on('robot-request', function(data){
            console.log('Request: '+data.mac);
            var request = robotRequest(data.id, data.mac);
            if (request === 'Conexion aceptada.'){
                var robotId = getRobotId(data.mac);
                console.log(robotId);
                app.locals.connections.push({id:data.id, mac:data.mac, socketUser:socket.id, socketRobot:robotId});
                console.log('Conexion aceptada papu');
            }else{
                console.log(request);
            }
            socket.emit('robot-request', request);
        });

        socket.on('videocall', function(data){
            app.locals.videocalls.push({users:[data.id1, data.id2]});
        });

        socket.on('videocall-close', function(data){
            for (let i = 0; i < app.locals.videocalls.length; i++) {
                if (app.locals.videocalls[i].id1 === data || app.locals.videocalls[i].id2 === data);
                    app.locals.videocalls.splice(i, 1);                
            }
        });

        socket.on('user-connection', function(data){
            console.log('User connected. (ID: '+data.id+')');
            io.emit('user-connection', data);
            data.socket = socket.id;
            app.locals.users.push(data);
            /*if (app.locals.robots[0] !== undefined)
                io.to(`${app.locals.robots[0].socket}`).emit('hola', 'arduino');*/
        });

        socket.on('disconnect', function(){
            for (var i = 0; i < app.locals.connections.length; i++) {
                if(app.locals.connections[i].socketRobot === socket.id || app.locals.connections[i].socketUser === socket.id)
                    app.locals.connections.splice(i, 1);
            }
            disconnectUser(socket.id);
            disconnectRobot(socket.id);
        });
    });

    function isInVideocall(id){
        for (let i = 0; i < app.locals.videocalls.length; i++) {
            const element = app.locals.videocalls[i];
            if (element.users[0] === id)
                return element.users[1];
            else if (element.users[1] === id)
                return element.users[0];
        }
        return id;
    }

    function getRobotSocket(id){
        var userId = isInVideocall(id);
        console.log(userId);
        for (var i = 0; i < app.locals.connections.length; i++) {
            if (app.locals.connections[i] === userId)
                return app.locals.connections[i].socketRobot;
        }
        return undefined;
    }

    function disconnectRobot(id){
        for(var i = 0; i<app.locals.robots.length; i++){
            if (app.locals.robots[i].socket === id){
                io.emit('robot-disconnect', app.locals.robots[i].mac);
                app.locals.robots.splice(i, 1);
                console.log('Arduino disconnected.');
            }
        }
    }

    function disconnectUser(id){
        for(var i = 0; i<app.locals.users.length; i++){
            if (app.locals.users[i].socket === id){
                io.emit('user-disconnect', app.locals.users[i].id);
                app.locals.users.splice(i, 1);
                console.log('User disconnected.');
            }
        }
    }

    function getRobotId(mac) {
        for (var i = 0; i < app.locals.robots.length; i++) {
            if(app.locals.robots[i].mac === mac)
                return app.locals.robots[i].socket;
        }
    }

    function robotRequest(userId, mac) {
        for (var i = 0; i < app.locals.connections.length; i++) {
            if (app.locals.connections[i].id === userId)
                return 'Ya estas conectado a un robot.';
            if (app.locals.connections[i].mac === mac){
                if (app.locals.connections[i].id === userId)
                    return 'Ya estas conectado a ese robot.';
                else
                    return 'El robot esta ocupado.';
            }
        }
        for (var i = 0; i < app.locals.robots.length; i++) {
            if(app.locals.robots[i].mac === mac){
                User.addRobot(userId, mac, function(){
                });
                return 'Conexion aceptada.';
            }
        }
        return 'El robot no existe o no esta conectado.';
    }
}