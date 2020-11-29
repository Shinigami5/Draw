
const c = document.querySelector('#canMain');
const c2 = document.querySelector('#seta');
c.width = 500;
c.height = 400;
c2.width = 500;
c2.height = 400;
const ctx = c.getContext('2d');
const ctx2 = c2.getContext('2d');

const height = c.height;
const width = c.width;

function showCorSelected(){
    const e = document.querySelector('#selected');
    e.style.backgroundColor = drawTela.corSelected;
}

function setCor(c){
    drawTela.corSelected = c;
    showCorSelected();
}

function limpaCanSeta(){
    ctx2.globalCompositeOperation = 'copy';
    ctx2.fillStyle = 'tranparent'
    ctx2.fillRect(0, 0, width, height);
    ctx2.beginPath();   //
    ctx2.moveTo(0, 0);  //
    ctx2.stroke();      //
}

function limpaCanMain(){
    modos['clear']();
    modo = 'pincel';
    socket.emit('draw', { tela: drawTela, modo: 'clear' });
}

function balde(){
    modos['bucket'](drawTela);
    socket.emit('draw', { tela: drawTela, modo: 'bucket' });
}

function borracha(){
    modo = 'eraser';
}

function lapis(){
    modo = 'pincel';
}

function seta(){
    modo = 'arrow';
}

function eye(){
    modo = 'eye';
}


let modo = 'pincel';

const drawTela = {
    desenhado: false,
    corSelected: 'black',
    lastLocation: { x: 0, y: 0 },
    x: 0,
    y: 0
};



function mouseDown(event){
    drawTela.lastLocation.x = event.offsetX;
    drawTela.lastLocation.y = event.offsetY;
    drawTela.desenhado = true;
    
    if(modo === 'eye'){
        modos[modo](drawTela);
    }
}

function mouseUp(){
    drawTela.desenhado = false;

    if(modo === 'arrow'){
        socket.emit('draw', { tela: drawTela, modo: 'drawArrow' });
        ctx.stroke();
        limpaCanSeta();
    }

        
}

function mousePress(event){
    if(drawTela.desenhado){
        drawTela.x = event.offsetX;
        drawTela.y = event.offsetY;
        if(modos[modo]){
            socket.emit('draw', { tela: drawTela, modo: modo });
            modos[modo](drawTela);
        }
    }
}


const modos = {
    pincel(drawTela){
        ctx.strokeStyle = drawTela.corSelected;
        ctx.beginPath();
        ctx.moveTo(drawTela.lastLocation.x, drawTela.lastLocation.y);
        ctx.lineTo(drawTela.x, drawTela.y);
        ctx.stroke();
        drawTela.lastLocation.x = drawTela.x;
        drawTela.lastLocation.y = drawTela.y;
    },

    eraser(drawTela){
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath();
        ctx.arc(drawTela.x, drawTela.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'
    },

    arrow(drawTela){
        ctx.beginPath();
        ctx.moveTo(drawTela.lastLocation.x, drawTela.lastLocation.y);
        ctx.lineTo(drawTela.x, drawTela.y);

        ctx2.globalCompositeOperation = 'copy';
        ctx2.fillStyle = 'tranparent';
        ctx2.fillRect(0, 0, width, height);
        ctx2.beginPath();
        ctx2.moveTo(drawTela.lastLocation.x, drawTela.lastLocation.y);
        ctx2.lineTo(drawTela.x, drawTela.y);
        ctx2.stroke();
    },

    eye(drawTela){
        const img = ctx.getImageData(drawTela.x, drawTela.y, 1, 1).data;
        let cor = `rgb(${img[0].toString()}, ${img[1].toString()}, ${img[2].toString()})`;
        setCor(cor);
        modo = 'pincel';
    },

    bucket(drawTela){
        ctx.fillStyle = drawTela.corSelected;
        ctx.fillRect(0, 0, width, height);
    },
    
    clear(){
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, width, height);
        limpaCanSeta();
    }

}

function ControllerTela(){
    const ativar = () => {
        c.addEventListener('mousedown', mouseDown);
        c.addEventListener('mousemove', mousePress);
        document.addEventListener('mouseup', mouseUp);
        c2.addEventListener('mousedown', mouseDown);
        c2.addEventListener('mousemove', mousePress);
        estado = desativar;
    }
    
    const desativar = () => {
        c.removeEventListener('mousedown', mouseDown);
        c.removeEventListener('mousemove', mousePress);
        document.removeEventListener('mouseup', mouseUp);
        c2.removeEventListener('mousedown', mouseDown);
        c2.removeEventListener('mousemove', mousePress);
        estado = ativar;
    }
    
    let estado = ativar;

    this.use = (timer) => {
        estado();
        setTimeout(() => {
            estado();
        }, timer);
    }
}

/*
export default function CanvasController(io){
    socket = io;

    return {
        setCor: setCor,
        clear: limpaCanMain,
        balde: balde,
        borracha: borracha,
        lapis: lapis,
        seta: seta,
        eye: eye,
        modos: modos,
        ControllerTela: ControllerTela,

        mouseDown: mouseDown,
        mousePress: mousePress,
        mouseUp: mouseUp
    }
}
*/