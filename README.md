# Draw

Draw é uma espécie de cópia do gartic.com.br, mais a parte das funcionalidades, mas diferente do gartic esse site apenas suporta uma sala com um limite de 10 jogadores, para jogar primeiro é preciso se cadastra e entra na sala. Abaixo estão os caminhos do site e suas explicações.

### /home
Aqui é onde se registar para jogar, o player deve informa um nome(sem espaço) e depois clica no botão “entra” para participar do jogo 

### /game
Onde o jogo ocorre, se o jogador entra aqui sem se registar será redirecionado para /home,  ao ingressar no jogo aparecerá ao lado esquerdo os players atuais, ao lado direito a tela de desenho e embaixo o chat, só poderá desenha na tela o jogador selecionado para tal no momento, se outro jogador tentar não conseguirá.
O chat é onde eles informa as palavras e fazer comentários, as palavras e comentários feitos por players são enviados para os outros na sala, se um jogador acerta ganha um ponto, se repedir a palavra nada ocorre os outros players também não receberão a palavra, o jogo não tem sistema de Victória cada acerto apenas garante um ponto, os jogadores jogar até cansarem


### O projeto
O site foi feito utilizado 
node js, socket.io, express

para rodar o projeto é preciso ter o node JS instalado, e seguir os passo abaixo

```sh
git pull rep
npm install
node server.js // para subir o server em localhost:5001
```
