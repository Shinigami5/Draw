
function drawPonit(x, y){
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    //darw.closePath();
    //ctx.stroke();
    ctx.fill();
}


const socket = io();

const playerSession = {
    nome: undefined
};

const chat = document.getElementById('chat');
const divComments = document.querySelector('.comments');


chat.onkeydown = (e) => {
    if(e.keyCode === 13){
        const message = e.target.value;
        divComments.innerHTML += '<div>' + playerSession.nome + ': ' + message + '</div>';
        e.target.value = '';
        socket.emit('meg', {  meg: message, nome: playerSession.nome } );
    }
}





function getCookie(){
    const cookie = 'nome=';
    let cookies = document.cookie;
    cookies = cookies.split(';');
    let res = '';

    for (let i = 0; i < cookies.length; i++) {
        let tmp = cookies[i].indexOf(cookie);
        if(tmp !== -1){
            res = cookies[i].substring(cookie.length);
        }
    }

    return res;
}

function deleteCookie(nome){
    let data = new Date();
    data = data.toUTCString();
    document.cookie = nome+'=tmp; '+ 'expires='+data+'; pach=/';
}

function showPlayers(player){
    const elem = document.querySelector('.areaPessoas');
                     //elem.getElementsByTagName(player.nome);
    const jaExiste = document.getElementById(player.nome);
    //console.log(jaExiste)

    if(!jaExiste){
        const strong1 = document.createElement('strong');
        const strong2 = document.createElement('strong');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        strong1.innerText = `Nome: ${player.nome}`;
        strong2.innerText = `Pontos: ${player.pontos}`;
    
        div1.className = 'data';
        div1.appendChild(strong1);
        div1.appendChild(document.createElement('br'));
        div1.appendChild(strong2);
        
        div2.className = 'player';
        div2.id = player.nome;
        div2.appendChild(div1);
        elem.appendChild(div2);

    }else{
        //console.log(jaExiste.id);
        const t = document.getElementById(jaExiste.id);
        //const t = elem.querySelector('#'+jaExiste.id);
        const at = t.querySelectorAll('strong');
        at[1].innerText = 'Pontos: ' + player.pontos;
    }
}

function deletaPlayer(nome){
    const elem = document.querySelector('.areaPessoas');
    const toRemove = elem.querySelector('#'+nome);
    if(toRemove) toRemove.remove(); 
}

function setUser(){
    playerSession.nome = getCookie();
    deleteCookie('nome');

    document.title = playerSession.nome;

    setTimeout(() => {
        fetch(`/game/id?id=${socket.id}&nome=${playerSession.nome}`, { method: 'post' }).then(res => {
            res.json().then(results => { console.log(results.meg); })
        })
    }, 100);
}

function updatePlayers(){
    socket.emit('updatePlayer');
}


function init(){
    setUser();
    updatePlayers();
    const playerDraw = new ControllerTela();
    
    socket.on('meg', (obj) => {
        if(obj.nome != playerSession.nome){
            divComments.innerHTML += '<div>' + obj.nome + ': ' + obj.meg + '</div>';
        }
    });

    socket.on('receber player', players => {
        if(players){
            players.forEach(player => {
                showPlayers(player);
            });
        }
    });

    socket.on('deleta player', nome => {
        deletaPlayer(nome);
    })

    socket.on('player draw', (obj) => {
        //console.log(nome)
        divComments.innerHTML += `<div> a tela é sua, a palavra é ${obj.word} </div>`;
        playerDraw.use(obj.timer);
    });

    socket.on('update list players', () => {
        updatePlayers();
    });

    socket.on('draw', obj => {
        if(modos[obj.modo])
            modos[obj.modo](obj.tela);
    
        if(obj.modo === 'drawArrow'){
            ctx.stroke();
            limpaCanSeta();
        }
    });

    socket.on('sys', (nome) => {
        nome = nome === playerSession.nome ? 'voce' : nome;
        divComments.innerHTML += '<div> Sys: ' + nome + ' acertou </div>';
    });

    socket.on('sys state', meg => {
        divComments.innerHTML += '<div> ' + meg + ' </div>';
    });

}

init();



//c.addEventListener('mouseover', precionado);      // mover o mouse sobre o Elem ?
//c.addEventListener('mouseleave', precionado);      // mover para fora do Elem
//c.addEventListener('mouseenter', precionado);      // mover para dendo do Elem ?

