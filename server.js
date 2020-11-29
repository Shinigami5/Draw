const express = require('express');
const server = express();
const path = require('path');
const http = require('http').createServer(server);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');

const gameLogic = require('./game.js');

const game = new gameLogic(io);


server.set('views', path.resolve(__dirname, 'paginas'));
server.set('view engine', 'ejs');
server.use(cookieParser());
server.use(express.static('public'));



server.get('/game', function(req, res){
    const nome = req.cookies.nome;
    const tmp = game.getPlayers().fill((obj) => {
        return obj.nome === nome;
    })
    
    if(tmp && nome !== undefined){
        res.render('index');
    }else{
        res.render('home');
    }
});

server.post('/game/id', function(req, res){
    const socketId = req.query.id;
    const nome = req.query.nome;
    
    if(typeof socketId === 'string' && socketId.length === 20){
        game.addIdPlayer(socketId, nome);
        res.json({ meg: 'sucesso' });
    }else{
        res.json({ meg: 'id é invalido' });
    }
});

server.get('/home', function(req, res){
    res.render('home');
});

server.post('/home', function(req, res){
    const nome = req.query.nome;
    const reg = RegExp(/ /);

    // verificar os char do nome, pois eles vao ser utilizados como !!tag ID!! 
    if(reg.test(nome)){
        res.json({ meg: 'digite um nome sem espaço' });
        return;
    }

    if(game.getPlayers().length <= 9){
        if(game.addPlayer(nome)){
            res.json({ meg: 'player cadastrado, entre na sala' });
        }else{
            res.json({ meg: 'escolha outro nome' });
        }
    }else{
        res.json({ meg: 'sala cheia' });
    }
});

server.get('/teste', function(req, res){
    const obj = { player: game.getPlayers(), wordAtual: game.wordAtual };
    res.json(obj);
});


http.listen('5001', () => {
    console.log('server on in port 5001');
});