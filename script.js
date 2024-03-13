//criando o canvas
var canvas = document.createElement("canvas");
var Altura = window.innerHeight;
var Largura = window.innerWidth;
if (Largura >= 500) {
  Largura = 500;
  Altura = 500;
}

class Game {
  constructor(dificult, currentState) {
    this.dificult = dificult;
    this.currentState = currentState
  }
  getCurrentState(){
    return this.currentState
  }

  setCurrentState(currentState){
    this.currentState = currentState
  }
  drawBackground() {
    //preenche o fundo com cinza escuro
    contexto.fillStyle = "dimgray";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    //calcada esquerda
    contexto.fillStyle = "lightgray";
    contexto.fillRect(0, 0, 100, canvas.height);

    //calcada direita
    contexto.fillStyle = "lightgray";
    contexto.fillRect(400, 0, 100, canvas.height);

    //faixas
    contexto.fillStyle = "white";
    for (var i = 0; i < 25; i++) {
      contexto.fillRect(195, i * 30 - 5, 4, 20);
      contexto.fillRect(305, i * 30 - 5, 4, 20);
    }
  }
}
//definindo suas medidas
canvas.width = Largura;
canvas.height = Altura;
//borda largura/tipo/cor
canvas.style.border = "1px solid black";
//inclui o canvas no body
document.body.appendChild(canvas);
//definindo o contexto
var contexto = canvas.getContext("2d");
//variaveis
var teclas = {},
  pontos,
  vida,
  ctd = 0,
  vetor = [],
  img,
  cont = 0,
  sentido = 0,
  sentidoc = 0,
  contc = 0,
  record = "",
  aux = 0,
  estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2,
    desafio: 3,
  },
  chefao = {
    x: 250,
    y: 60,
    movimentacao: 2.5,
    desenho: function () {
      boss.desenha(this.x, this.y);
    },
  },
  vidaChefao = {
    x: 50,
    y: 10,
    largura: 200,
    altura: 25,
    cor: "red",
    desenho: function () {
      contexto.fillStyle = this.cor;
      contexto.fillRect(this.x, this.y, this.largura, this.altura);
    },
  },
  balaChefao = {
    x: 285,
    y: chefao.y + 108,
    speed: 6,
    tiro1: function () {
      BalaBoss.desenha(this.x, this.y);
    },
  },
  vidaExtra = {
    x: chefao.x,
    y: -100,
    speed: 5,
    desenho: function () {
      maleta.desenha(this.x, this.y);
    },
  },
  jogador = {
    score: 0,
    vidas: 3,
    x: 250,
    y: 350,
    speed: 5,
    desenho: function () {
      personagem.desenha(this.x, this.y);
    },
  },
  bala = {
    x: 250,
    y: -500,
    speed: 10,
    tiro1: function () {
      Bala.desenha(this.x, this.y);
    },
  },
  inimigo = {
    x: 250,
    y: 0,
    largura: 50,
    altura: 50,
    movimentacao: 2.5,
    i: 0,
    speed: 2,
    desenho: function () {
      switch (this.i) {
        case 0:
          audi.desenha(this.x, this.y);
          break;
        case 1:
          carroPreto.desenha(this.x, this.y);
          break;
        case 2:
          taxi.desenha(this.x, this.y);
          break;
        case 3:
          carro.desenha(this.x, this.y);
          break;
      }
    },
  };

// muda de estado com click
function clique(click) {
  if (game.getCurrentState() == estados.jogar) {
    game.setCurrentState(estados.jogando);
  }
  if (game.getCurrentState() == estados.perdeu) {
    game.setCurrentState(estados.jogando);
  }
}
function desenho() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  game.drawBackground();

  //açoes que ocorrem em cada estado
  if (game.getCurrentState() == estados.jogar) {
    fundo.desenha(0, 0);
    contexto.fillStyle = "green";
    contexto.fillRect(Largura / 2 - 100, 100, 200, 100);
    contexto.font = "28px arial ";
    contexto.fillStyle = "white";
    contexto.fillText("START", 210, 160);
  } else if (game.getCurrentState() == estados.perdeu) {
    contexto.fillStyle = "#669999";
    contexto.fillRect(0, 0, 500, 500);
    contexto.font = "32px arial ";
    contexto.fillStyle = "white";
    contexto.fillText("Recordes: ", 200, 50);
    for (var i = 0; i < ctd; i++) {
      contexto.fillText(i + 1 + "º: " + vetor[i], 230, 80 + i * 30);
    }
    contexto.fillStyle = "#6699CC";
    contexto.fillRect(0, 450, 500, 50);
    contexto.font = "28px Engravers MT ";
    contexto.fillStyle = "white";
    contexto.fillText("Jogar Novamente", 60, 485);
  } else if (game.getCurrentState() == estados.jogando) {
    contexto.font = "20px arial ";
    contexto.fillStyle = "black";
    contexto.fillText("Score: " + jogador.score, 10, 20);
    contexto.fillText("Dificuldade: " + game.dificult, 200, 20);
    contexto.fillText("Vidas: " + jogador.vidas, 120, 20);
    moveinimigo();
    bala.tiro1();
    movejogador();
    inimigo.desenho();
    jogador.desenho();
    dificuldade();
  } else if (game.getCurrentState() == estados.desafio) {
    vidaExtra.desenho(); //VidaExtra();
    chefao.desenho();
    vidaChefao.desenho();
    jogador.desenho();
    bala.tiro1();
    movejogador();
    moveChefao();
    balaChefao.tiro1();
    contexto.fillText("Vidas: " + jogador.vidas, 220, 500);
  }
}
function roda() {
  desenho();
  //coloca em lop a parte de desenha e atualiza
  window.requestAnimationFrame(roda);
}
function main() {
  game.setCurrentState(estados.jogar);
  img = new Image();
  img.src = "newsprite.png";
  roda();
  document.addEventListener("mousedown", clique);
}
document.addEventListener(
  "keydown",
  function (e) {
    teclas[e.keyCode] = true;
  },
  false
);
function movejogador() {
  if (38 in teclas && jogador.y >= 30) {
    jogador.y -= jogador.speed;
  }
  if (40 in teclas && jogador.y <= 370) {
    jogador.y += jogador.speed;
  }
  if (37 in teclas && jogador.x >= 105) {
    jogador.x -= jogador.speed;
  }
  if (39 in teclas && jogador.x <= 320) {
    jogador.x += jogador.speed;
  }
  if (32 in teclas) {
    bala.y -= bala.speed;
    if (bala.y <= -50) {
      bala.x = jogador.x + 37.5;
      bala.y = jogador.y;
    }
  }
  if (bala.y > -50) {
    bala.y -= bala.speed;
  }

  //limita as vidas
  if (jogador.vidas < 0) {
    pontos = jogador.score;
    vetor[ctd] = pontos;
    ctd += 1;
    game.setCurrentState(estados.perdeu);
    jogador.vidas = 3;
    jogador.score = 0;
    vidaChefao.largura = 400;
    chefao.x = 250;
    chefao.y = 60;
    for (var i = 0; i < ctd; i++) {
      for (var j = 0; j < ctd; j++) {
        if (vetor[i] > vetor[j]) {
          aux = vetor[j];
          vetor[j] = vetor[i];
          vetor[i] = aux;
        }
      }
    }
  }
}
function moveChefao() {
  if (vidaChefao.largura > 0) {
    cont += 1;
    //tiro aleatorio
    if (balaChefao.y < 550) {
      balaChefao.y += balaChefao.speed;
      if (balaChefao.y >= 530) {
        balaChefao.x = chefao.x + 37.5;
        balaChefao.y = chefao.y + 108;
      }
    }
    if (cont == 50) {
      // escolhe entre ir pra direita ou para esquerda
      sentido = parseInt(Math.random() * 2);
      cont = 0;
    }
    if (sentido == 0) {
      chefao.x -= chefao.movimentacao;
    } else if (sentido == 1) {
      chefao.x += chefao.movimentacao;
    }
    if (chefao.x <= 100) {
      sentido = 1;
    }
    if (chefao.x > 317) {
      sentido = 0;
    }
    vidaExtra.y = chefao.y + 5;
    vidaExtra.x = chefao.x + 10;
    // colisao do tiro do boss
    if (
      balaChefao.y >= jogador.y &&
      balaChefao.y - 22 <= jogador.y &&
      balaChefao.x >= jogador.x &&
      balaChefao.x <= jogador.x + 77
    ) {
      expl.desenha(jogador.x, jogador.y);
      expl.desenha(jogador.x - 5, jogador.y + 10);
      balaChefao.y = chefao.y + 108;
      balaChefao.x = chefao.x + 35;
      jogador.vidas -= 1;
    }

    // colisao do tiro do jogador no boss
    if (
      bala.y + 104 >= chefao.y &&
      bala.y - 105 <= chefao.y &&
      bala.x >= chefao.x &&
      bala.x <= chefao.x + 83
    ) {
      expl.desenha(chefao.x, chefao.y);
      expl.desenha(chefao.x - 5, chefao.y + 10);
      bala.y = -500;
      vidaChefao.largura -= 20;
    }
  }

  if (vidaChefao.largura < 1) {
    vidaExtra.y += vidaExtra.speed;

    chefao.y = -300;
    balaChefao.y = chefao.y;
    if (
      jogador.y + 56 >= vidaExtra.y &&
      jogador.y - 55 <= vidaExtra.y &&
      jogador.x >= vidaExtra.x - 75 &&
      jogador.x <= vidaExtra.x + 60
    ) {
      jogador.vidas += 5;
      vidaExtra.y = 560;
      jogador.score += 5;
      game.setCurrentState(estados.jogando);
    }
    if (vidaExtra.y > 550) {
      jogador.score += 5;
      game.setCurrentState(estados.jogando);
    }
  }
}
function moveinimigo() {
  if (inimigo.y < 500) {
    inimigo.y += inimigo.speed;
  }
  if (inimigo.y >= 500) {
    inimigo.i = parseInt(Math.random() * 4);
    inimigo.x = parseFloat(250 * Math.random() + 100);
    inimigo.y = -50;
    inimigo.y += inimigo.speed;
  }
  contc += 1;
  if (contc == 50) {
    // escolhe entre ir pra direita ou para esquerda
    sentidoc = parseInt(Math.random() * 2);
    contc = 0;
  }
  if (sentidoc == 0) {
    inimigo.x -= inimigo.movimentacao;
  } else if (sentidoc == 1) {
    inimigo.x += inimigo.movimentacao;
  }
  if (inimigo.x <= 100) {
    sentidoc = 1;
  }
  if (inimigo.x > 317) {
    sentidoc = 0;
  }

  //colisao entre o jogador e o carro
  if (
    jogador.y >= inimigo.y - 120 &&
    jogador.y <= inimigo.y + 90 &&
    jogador.x >= inimigo.x - 80 &&
    jogador.x <= inimigo.x + 40
  ) {
    expl.desenha(inimigo.x, inimigo.y);
    jogador.vidas -= 1;
    inimigo.i = parseInt(4 * Math.random());
    inimigo.x = parseFloat(250 * Math.random() + 100);
    inimigo.y = -50;
  }
  //colisao entre o tiro e o carro
  if (
    bala.y + 104 >= inimigo.y &&
    bala.y - 105 <= inimigo.y &&
    bala.x >= inimigo.x - 8 &&
    bala.x <= inimigo.x + 58
  ) {
    expl.desenha(inimigo.x, inimigo.y);
    expl.desenha(inimigo.x - 5, inimigo.y + 10);
    inimigo.i = parseInt(4 * Math.random());
    inimigo.x = parseFloat(250 * Math.random() + 100);
    inimigo.y = -50;
    jogador.score += 5;
    bala.y = -500;
  }
}
function dificuldade() {
  if (jogador.score >= 0 && jogador.score < 95) {
    inimigo.speed = 1; //aumenta a velocidade do inimigo
    game.dificult = "Muito Fácil";
  }
  if (jogador.score == 95) {
    balaChefao.y = chefao.y;
    balaChefao.x = chefao.x;
    game.setCurrentState(estados.desafio);
  } else if (jogador.score > 100 && jogador.score <= 240) {
    inimigo.speed = 2;
    game.dificult = "Fácil";
  }
  if (jogador.score == 240) {
    chefao.y = 60;
    balaChefao.y = chefao.y;
    balaChefao.x = chefao.x;
    vidaChefao.largura = 300;
    game.setCurrentState(estados.desafio);
  } else if (jogador.score > 240 && jogador.score <= 720) {
    inimigo.speed = 4;
    game.dificult = "Médio";
  }
  if (jogador.score == 720) {
    chefao.y = 60;
    balaChefao.y = chefao.y;
    balaChefao.x = chefao.x;
    vidaChefao.largura = 400;
    game.setCurrentState(estados.desafio);
  } else if (jogador.score > 720 && jogador.score <= 1440) {
    inimigo.speed = 6;
    game.dificult = "Difícil";
  }
  if (jogador.score == 1440) {
    chefao.y = 60;
    balaChefao.y = chefao.y;
    balaChefao.x = chefao.x;
    vidaChefao.largura = 500;
    game.setCurrentState(estados.desafio);
  } else if (jogador.score > 1440) {
    inimigo.speed = 8;
    game.dificult = "Muito Difícil";
  }
  if (jogador.score == 2000) {
    chefao.y = 60;
    balaChefao.y = chefao.y;
    balaChefao.x = chefao.x;
    vidaChefao.largura = 600;
    game.setCurrentState(estados.desafio);
  }
}

document.addEventListener(
  "keyup",
  function (e) {
    delete teclas[e.keyCode];
  },
  false
);

//inicializa o jogo
let game = new Game(0, 0, "Muito Fácil")
main();
