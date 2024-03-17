//criando o canvas
var canvas = document.createElement("canvas");
var Altura = window.innerHeight;
var Largura = window.innerWidth;
if (Largura >= 500) {
  Largura = 500;
  Altura = 500;
}

class GameObject{
  constructor(position, speed, sprite){
    this.position = position;
    this.speed = speed;
    this.sprite = sprite;
  }

  getSpeed(){
    return this.speed
  }
  setSpeed(speed){
    this.speed = speed
  }
  setPosition(position){
      this.position = position;
  }
  setPositionX(x){
      this.position.x = x;
  }
  setPositionY(y){
      this.position.y = y;
  }
  getPosition(){
    return this.position
  }

  moveLeft(){
    if(this.getPosition().x >= 105) {
      this.setPositionX(this.getPosition().x - this.getSpeed());
    }
  }

  moveRight(){
    if(this.getPosition().x <= 320) {
      this.setPositionX(this.getPosition().x + this.getSpeed());
    }
  }

  moveFoward(){
      if(this.getPosition().y >= 30){
        this.setPositionY(this.getPosition().y - this.getSpeed());
      }
  }

  moveBackward(){
      this.setPositionY(this.getPosition().y + this.getSpeed());
  }

  draw(){
    this.sprite.desenha(this.position.x, this.position.y);
  }

  explosion(){
    expl.desenha(this.getPosition().x, this.getPosition().y);
  }

}

class Bullet extends GameObject{
  constructor(posistion, speed, sprite){
    super(posistion, speed, sprite);
  }

  moveFoward(){
    this.setPositionY(this.getPosition().y - this.getSpeed());
  }
  moveBackward(){
    this.setPositionY(this.getPosition().y + this.getSpeed());
  }
}

class  Player extends GameObject{
  constructor(position, score, lifes, speed, sprite){
    super(position, speed, sprite);
    this.score = score;
    this.lifes = lifes;
  }

  getLifes() {return this.lifes;}
  getScore(){return this.score;}

  setLifes(lifes) {this.lifes = lifes;}
  setScore(score) {this.score = score;}
  
  decreaseLife(){
    this.setLifes(this.getLifes()-1);
  }
  increaseLife(qtd = 5){
    this.setLifes(this.getLifes()+qtd);
  }

  increaseScore(){
    this.setScore(this.getScore() + 5);
  }
  moveBackward(){
    if(this.getPosition().y <= 370){
      this.setPositionY(this.getPosition().y + this.getSpeed());
    }
  }

}

class LifeBar extends GameObject{
  constructor(position, speed, width, height, color = "red"){
    super(position, speed)
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw(){
    contexto.fillStyle = this.color;
    contexto.fillRect(this.getPosition().x, this.getPosition().y, this.width, this.height);
  }

}

class Boss extends GameObject{
  constructor(position, speed, sprite){
    super(position, speed, sprite)
    this.lifeBar = new LifeBar({x:50, y:10}, 0, 200, 25)
  }

  setBarLife(life){
    this.lifeBar.width = life;
  }

  hasLife(){
    if(this.lifeBar.width > 0) return true;
    return false;
  }

  decreaseLife(){
    this.lifeBar.width -= 20
  }


}

class Enemy extends GameObject{
  constructor(position, speed, sprites){
    super(position, speed, sprites[0])
    this.index = 0;
    this.sprites = sprites
  }
  changeCar(){
    this.index = parseInt(Math.random() * this.sprites.length);
  }
  reset(){
    this.changeCar()
    this.setPositionX(parseFloat(250 * Math.random() + 100));
    this.setPositionY(-50);
  }
  draw(){
    this.sprites[this.index].desenha(this.position.x, this.position.y)
  }
}

class Game {
  static states = {
                    play: 0,
                    playing: 1,
                    lost: 2,
                    challenge: 3,
                  }
  constructor(dificult, currentState) {
    this.dificult = dificult;
    this.currentState = currentState
    this.changeState = this.changeState.bind(this);
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

  lost(){
    this.setCurrentState(Game.states.lost);
  }

  playing(){
    this.setCurrentState(Game.states.playing);
  }

  challenge(){
    this.setCurrentState(Game.states.challenge);
  }

  isStatePlay(){
    return this.getCurrentState() == Game.states.play;
  }

  isStateLost(){
    return this.getCurrentState() == Game.states.lost;
  }

  isStatePlaying(){
    return this.getCurrentState() == Game.states.playing;
  }

  isStateChallenge(){
    return this.getCurrentState() == Game.states.challenge;
  }

  changeState(){
    if (this.isStatePlay() || this.isStateLost()) {
      this.setCurrentState(Game.states.playing);
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

boss = new Boss({x:250, y:60}, 2.5, bossD);
bulletBoss =  new Bullet({x:285, y: boss.getPosition().y + 108}, 6, BalaBoss);
extraLife = new GameObject({x: boss.getPosition().x, y: -100}, 5, maleta);
player = new Player( {x: 250, y: 350}, 0, 3, 5, personagem);
bulletPlayer = new Bullet({x: 250, y: -500}, 10, Bala);
enemy = new Enemy({x: 250, y: 0}, 3, [audi, carroPreto, taxi, carro]);
let game = new Game("Muito Fácil", Game.states.play);

function desenho() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  game.drawBackground();

  //açoes que ocorrem em cada estado
  if (game.isStatePlay()) {
    fundo.desenha(0, 0);
    contexto.fillStyle = "green";
    contexto.fillRect(Largura / 2 - 100, 100, 200, 100);
    contexto.font = "28px arial ";
    contexto.fillStyle = "white";
    contexto.fillText("START", 210, 160);
  } else if (game.isStateLost()) {
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
  } else if (game.isStatePlaying()) {
    contexto.font = "20px arial ";
    contexto.fillStyle = "black";
    contexto.fillText("Score: " + player.getScore(), 10, 20);
    contexto.fillText("Dificuldade: " + game.dificult, 200, 20);
    contexto.fillText("Vidas: " + player.getLifes(), 120, 20);
    moveinimigo();
    bulletPlayer.draw();
    movejogador();
    enemy.draw();
    player.draw();
    dificuldade();
  } else if (game.isStateChallenge()) {
    extraLife.draw(); //VidaExtra();
    boss.draw();
    boss.lifeBar.draw()
    player.draw();
    bulletPlayer.draw();
    movejogador();
    moveChefao();
    bulletBoss.draw();
    contexto.fillText("Vidas: " + player.getLifes(), 220, 500);
  }
}
function roda() {
  desenho();
  //coloca em lop a parte de desenha e atualiza
  window.requestAnimationFrame(roda);
}
function main() {
  img = new Image();
  img.src = "newsprite.png";
  roda();
  document.addEventListener("mousedown", game.changeState);
}
document.addEventListener(
  "keydown",
  function (e) {
    teclas[e.keyCode] = true;
  },
  false
);
function movejogador() {
  if (38 in teclas) {
    player.moveFoward();
  }
  if (40 in teclas) {
    player.moveBackward();
  }
  if (37 in teclas) {
    player.moveLeft();
  }
  if (39 in teclas) {
    player.moveRight();
  }
  if (32 in teclas) {
    bulletPlayer.moveFoward();
    if (bulletPlayer.getPosition().y <= -50) {
      bulletPlayer.setPositionX(player.getPosition().x + 37.5);
      bulletPlayer.setPositionY(player.getPosition().y);
    }
  }
  if (bulletPlayer.getPosition().y > -50) {
    bulletPlayer.moveFoward();
  }

  //limita as vidas
  if (player.getLifes() < 0) {
    pontos = player.getScore();
    vetor[ctd] = pontos;
    ctd += 1;
    game.lost()
    player.setLifes(3);
    player.setScore(0);
    boss.setBarLife(400);
    boss.getPosition().x = 250;
    boss.getPosition().y = 60;
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
  if (boss.hasLife()) {
    cont += 1;
    //tiro aleatorio
    if (bulletBoss.getPosition().y < 550) {
      bulletBoss.moveBackward();
      if (bulletBoss.getPosition().y >= 530) {
        bulletBoss.setPositionX(boss.getPosition().x + 37.5);
        bulletBoss.setPositionY(boss.getPosition().y + 108);
      }
    }
    if (cont == 50) {
      // escolhe entre ir pra direita ou para esquerda
      sentido = parseInt(Math.random() * 2);
      cont = 0;
    }
    if (sentido == 0) {
      boss.moveLeft();
    } else if (sentido == 1) {
      boss.moveRight();
    }
    if (boss.getPosition().x <= 100) {
      sentido = 1;
    }
    if (boss.getPosition().x > 317) {
      sentido = 0;
    }
    extraLife.setPositionY(boss.getPosition().y + 5);
    extraLife.setPositionX(boss.getPosition().x + 10);
    // colisao do tiro do boss
    if (
      bulletBoss.getPosition().y >= player.getPosition().y &&
      bulletBoss.getPosition().y - 22 <= player.getPosition().y &&
      bulletBoss.getPosition().x >= player.getPosition().x &&
      bulletBoss.getPosition().x <= player.getPosition().x + 77
    ) {
      player.explosion();
      bulletBoss.getPosition().y = boss.getPosition().y + 108;
      bulletBoss.getPosition().x = boss.getPosition().x + 35;
      player.decreaseLife();
    }

    // colisao do tiro do jogador no boss
    if (
      bulletPlayer.getPosition().y + 104 >= boss.getPosition().y &&
      bulletPlayer.getPosition().y - 105 <= boss.getPosition().y &&
      bulletPlayer.getPosition().x >= boss.getPosition().x &&
      bulletPlayer.getPosition().x <= boss.getPosition().x + 83
    ) {
      boss.explosion()
      bulletPlayer.getPosition().y = -500;
      boss.decreaseLife();
    }
  }

  if (!boss.hasLife()) {
    extraLife.moveBackward();

    boss.getPosition().y = -300;
    bulletBoss.setPositionY(boss.getPosition().y);
    if (
      player.getPosition().y + 56 >= extraLife.getPosition().y &&
      player.getPosition().y - 55 <= extraLife.getPosition().y &&
      player.getPosition().x >= extraLife.getPosition().x - 75 &&
      player.getPosition().x <= extraLife.getPosition().x + 60
    ) {
      player.increaseLife();
      extraLife.setPositionY(500);
      player.increaseScore();
      game.playing()
    }
    if (extraLife.getPosition().y > 550) {
      player.increaseScore();
      game.playing()
    }
  }
}
function moveinimigo() {
  if (enemy.getPosition().y < 500) {
    enemy.moveBackward();
  }
  if (enemy.getPosition().y >= 500) {
    enemy.reset();
  }
  contc += 1;
  if (contc == 50) {
    // escolhe entre ir pra direita ou para esquerda
    sentidoc = parseInt(Math.random() * 2);
    contc = 0;
  }
  if (sentidoc == 0) {
    enemy.moveLeft();
  } else if (sentidoc == 1) {
    enemy.moveRight()
  }
  //colisao entre o jogador e o carro
  if (
    player.getPosition().y >= enemy.getPosition().y - 120 &&
    player.getPosition().y <= enemy.getPosition().y + 90 &&
    player.getPosition().x >= enemy.getPosition().x - 80 &&
    player.getPosition().x <= enemy.getPosition().x + 40
  ) {
    enemy.explosion()
    player.decreaseLife();
    enemy.reset()
  }
  //colisao entre o tiro e o carro
  if (
    bulletPlayer.getPosition().y + 104 >= enemy.getPosition().y &&
    bulletPlayer.getPosition().y - 105 <= enemy.getPosition().y &&
    bulletPlayer.getPosition().x >= enemy.getPosition().x - 8 &&
    bulletPlayer.getPosition().x <= enemy.getPosition().x + 58
  ) {
    enemy.explosion()
    enemy.reset()
    player.increaseScore();
    bulletPlayer.getPosition().y = -500;
  }
}
function dificuldade() {
  if (player.getScore() >= 0 && player.getScore() < 95) {
    enemy.setSpeed(1);
    game.dificult = "Muito Fácil";
  }
  if (player.getScore() == 95) {
    bulletBoss.setPositionY(boss.getPosition().y);
    bulletBoss.setPositionX(boss.getPosition().x);
    game.challenge();
  } else if (player.getScore() > 100 && player.getScore() <= 240) {
    enemy.setSpeed(2);
    game.dificult = "Fácil";
  }
  if (player.getScore() == 240) {
    boss.getPosition().y = 60;
    bulletBoss.setPositionY(boss.getPosition().y);
    bulletBoss.setPositionX(boss.getPosition().x)
    boss.setBarLife(300);
    game.challenge();
  } else if (player.getScore() > 240 && player.getScore() <= 720) {
    enemy.setSpeed(4);
    game.dificult = "Médio";
  }
  if (player.getScore() == 720) {
    boss.getPosition().y = 60;
    bulletBoss.setPositionY(boss.getPosition().y);
    bulletBoss.setPositionX(boss.getPosition().x);
    boss.setBarLife(400);
    game.challenge();
  } else if (player.getScore() > 720 && player.getScore() <= 1440) {
    enemy.setSpeed(6)
    game.dificult = "Difícil";
  }
  if (player.getScore() == 1440) {
    boss.getPosition().y = 60;
    bulletBoss.setPositionY(boss.getPosition().y);
    bulletBoss.setPositionX(boss.getPosition().x);
    boss.setBarLife(500);
    game.challenge();
  } else if (player.getScore() > 1440) {
    enemy.setSpeed(8);
    game.dificult = "Muito Difícil";
  }
  if (player.getScore() == 2000) {
    boss.getPosition().y = 60;
    bulletBoss.setPositionY(boss.getPosition().y);
    bulletBoss.setPositionX(boss.getPosition().x);
    boss.setBarLife(600);
    game.challenge();
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
main();
