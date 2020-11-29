const words = require('./word.json');

class game {
    listWord = [];
    listPlayerHit = [];
    cout = 0;
    players = [];
    wordAtual = '';
    DesenhoAtual = [];

    constructor(socket){
        this.io = socket;
        this.initList();
        this.wordAtual = this.newWord();
        this.initTimer();
        this.listenIO();   
    }

    initTimer(){
        let tempo = 30000;
        let ID;
        let coutNome = 0;
        
        const encerraPartida = () => {
            this.io.emit('sys state', 'Sys: tempo da partida encerrada');
            this.wordAtual = this.newWord();
            this.listPlayerHit.splice(0, this.listPlayerHit.length);
            this.DesenhoAtual = []; // limpa o historico
            const limpa = { tela: {}, modo: 'clear' }
            this.io.emit('draw', limpa);
            
            clearInterval(ID);
            fun = choosePlayertoDraw;
            tempo = 3000;
            ID = setTimer(fun, tempo);
        };
        
        const choosePlayertoDraw = () => {
            if(this.players.length != 0){
                const player = this.players[coutNome] !== undefined ? this.players[coutNome] : this.players[0];
    
                this.io.to(player.socketId).emit('player draw', { word: this.wordAtual, timer: 30000 });
                coutNome = coutNome >= this.players.length-1 ? 0 : coutNome+1;
                this.listPlayerHit.push(player.nome);   //  isso serve para impedir que o jogador desenhista
                                                            //  ganhe pontos
            }
            clearInterval(ID);
            fun = encerraPartida;
            tempo = 30000;
            ID = setTimer(fun, tempo);
        };
        
        const setTimer = (fun, tempo) => {
            return setInterval(fun, tempo);
        }
        
        let fun = encerraPartida;
        ID = setTimer(fun, tempo);
    }
    
    initList(){
        for (let i = 0; i < words.length; i++) {
            this.listWord.push(words[i]);
        }
    }

    newWord(){
        const w = this.listWord[this.cout];
        this.cout = this.cout >= this.listWord.length-1 ? 0 : this.cout+1;
        return w;
    }

    beOnList(obj){
        const res = this.listPlayerHit.find(nomeL => {
            if(obj.nome === nomeL) return true;
        })
        if(!res){
            console.log(obj.nome+' acertou');
            this.listPlayerHit.push(obj.nome);
            this.addPonto(obj.nome);
            this.io.emit('sys', obj.nome);
        }
    }

    verificarWord(objMeg){
        if(objMeg.meg.length <= 30){
            if(objMeg.meg === this.wordAtual){
                this.beOnList(objMeg);
            }else{
                this.io.emit('meg', objMeg);
            }
        }else{
            this.io.emit('meg', objMeg);
        }
    }

    addPlayer(nome){
        const redundancia = this.players.find((n) => {
            return n.nome === nome;
        });
        if(redundancia === undefined){
            this.players.push({ socketId: undefined, nome: nome, pontos: 0 });
            this.io.emit('update list players');
            return true;
        }else{
            return false;
        }
    }

    addIdPlayer(id, nome){
        this.players.find(player => {
            if(player.nome === nome){
                player.socketId = id;
            }
        });
    }

    removePlayer(id){
        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].socketId === id){
                this.io.emit('deleta player', this.players[i].nome);
                this.players.splice(i, 1);
                break;
            }
        }
    }

    addPonto(player){
        this.players.forEach(obj => {
            if(obj.nome === player){
                obj.pontos += 1;
                this.io.emit('update list players');
            }
        });
    }

    getPlayers(){
        const arr = this.players.map(player => {
            return { nome: player.nome, pontos: player.pontos };
        });

        return arr;
    }

    getNomeOfPlayers(){
        let nomes = [];
        this.players.forEach(e => {
            nomes.push = e.nome;
        })
        return nomes;
    }

    addItemToHistoric(item){
        if(item.modo === 'clear' || item.modo === 'bucket'){
            this.DesenhoAtual = [];
            this.DesenhoAtual.push(item);
        }else{
            this.DesenhoAtual.push(item);
        }
    }

    listenIO(){
        this.io.on('connection', (socket) => {
            //socket.join('sala 1');
        
            for (let i = 0; i < this.DesenhoAtual.length; i++) {
                socket.emit('draw', this.DesenhoAtual[i]);
            }
        
            socket.on('meg', meg => {
                this.verificarWord(meg);
            });
        
            socket.on('draw', draw => {
                this.addItemToHistoric(draw);
                this.io.emit('draw', draw);
            });
        
            socket.on('enviar player', player => {
                this.io.emit('receber player', player);
            });
        
            socket.on('updatePlayer', () => {
                const playersGame = this.getPlayers();
                socket.emit('receber player', playersGame);
            })
        
            socket.on('disconnecting', (meg) => {
                this.removePlayer(socket.id);
            });
        
        }); 
    }

}

module.exports = game;