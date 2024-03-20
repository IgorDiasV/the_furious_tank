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
    this.bullet = new Bullet({x: 250, y: -500}, 10, Bala);
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

  shoot(){
    this.bullet.moveFoward();
    if (this.bullet.getPosition().y <= -50) {
      this.bullet.setPositionX(this.getPosition().x + 37.5);
      this.bullet.setPositionY(this.getPosition().y);
    }
  }

  reset(){
    this.setLifes(3);
    this.setScore(0);
  }

}

class LifeBar extends GameObject{
  constructor(position, speed, width, height, color = "red"){
    super(position, speed)
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw(renderer){
    renderer.drawRect(this.color, this.getPosition().x, this.getPosition().y, this.width, this.height)
  }

}

class Boss extends GameObject{
  constructor(position, speed, sprite){
    super(position, speed, sprite)
    this.lifeBar = new LifeBar({x:50, y:10}, 0, 200, 25)
    this.bullet =  new Bullet({x:285, y: this.getPosition().y + 108}, 6, BalaBoss);
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

  shoot(){
    if (this.bullet.getPosition().y < 550) {
      this.bullet.moveBackward();
      if (this.bullet.getPosition().y >= 530) {
        this.bullet.setPositionX(this.getPosition().x + 37.5);
        this.bullet.setPositionY(this.getPosition().y + 108);
      }
    }
  }

  reset(){
    this.setBarLife(400);
    this.getPosition().x = 250;
    this.getPosition().y = 60;
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
    this.records = [];
  }

  getRecords(){ 
    this.records.sort();
    return this.records;
  }

  getCurrentState(){
    return this.currentState
  }

  setCurrentState(currentState){
    this.currentState = currentState
  }

  addScore(record){ this.records.push(record); }
  
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

class CanvasRenderer{
  constructor(width, height){
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.border = "1px solid black";
    this.context = this.canvas.getContext("2d");
  }
  getCanvas(){
    return this.canvas
  }
  drawBackground(){
    //preenche o fundo com cinza escuro
    this.drawRect("dimgray", 0, 0, this.canvas.width, this.canvas.height);

    //calcada esquerda
    this.drawRect("lightgray", 0, 0, 100, this.canvas.height);

    //calcada direita
    this.drawRect("lightgray", 400, 0, 100, this.canvas.height);

    //faixas
    for (var i = 0; i < 25; i++) {
      this.drawRect("white", 195, i * 30 - 5, 4, 20);
      this.drawRect("white", 305, i * 30 - 5, 4, 20);
    }
  }
  drawRect(color, x, y, width, height){
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }
  writeText(text, x, y, font="28px arial", color='white'){
    this.context.font=font;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  writeStatus(score, dificult, lifes){
    this.writeText("Score: " + score, 10, 20, "20px arial", "black");
    this.writeText("Dificuldade: " + dificult, 200, 20, "20px arial", "black");
    this.writeText("Vidas: " + lifes, 120, 20, "20px arial", "black");
  }

  drawStartPage(){
    fundo.desenha(0, 0);
    this.drawRect("green", this.canvas.width / 2 - 100, 100, 200, 100)
    this.writeText("START", 210, 160);
  }

  drawRecordPage(records){
    this.drawRect("#669999", 0, 0, 500, 500);
    this.writeText("Recordes: ", 200, 50, "32px arial");
    for (var i = 0; i < records.length; i++) {
      this.writeText(i + 1 + "º: " + records[i], 230, 80 + i * 30, "32px arial");
    }
    this.drawRect("#6699CC", 0, 450, 500, 50)
    this.writeText("Jogar Novamente", 60, 485, "28px Engravers MT");
  }
  
}

//variaveis
var teclas = {},
  cont=0,
  img,
  sentido = 0,
  sentidoc = 0,
  contc = 0

let boss = new Boss({x:250, y:60}, 2.5, bossD);
let extraLife = new GameObject({x: boss.getPosition().x, y: -100}, 5, maleta);
let player = new Player( {x: 250, y: 350}, 0, 3, 5, personagem);
let enemy = new Enemy({x: 250, y: 0}, 3, [audi, carroPreto, taxi, carro]);
let game = new Game("Muito Fácil", Game.states.play);
let  renderer = new CanvasRenderer(Largura, Altura);

document.body.appendChild(renderer.getCanvas());

function desenho() {
  renderer.context.clearRect(0, 0, Altura, Largura);
  renderer.drawBackground();

  //açoes que ocorrem em cada estado
  if (game.isStatePlay()) {
    renderer.drawStartPage();

  } else if (game.isStateLost()) {
    renderer.drawRecordPage(game.getRecords());
  } else if (game.isStatePlaying()) {
    renderer.writeStatus(player.getScore(), game.dificult, player.getLifes())
    moveinimigo();
    movejogador();
    enemy.draw();
    player.draw();
    player.bullet.draw();
    dificuldade();
  } else if (game.isStateChallenge()) {
    extraLife.draw(); //VidaExtra();
    boss.draw();
    boss.bullet.draw();
    boss.lifeBar.draw(renderer);
    player.draw();
    player.bullet.draw()
    movejogador();
    moveChefao();
    renderer.writeText("Vidas: " + player.getLifes(), 220, 500);
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
    player.shoot();
  }
  if (player.bullet.getPosition().y > -50) {
    player.bullet.moveFoward();
  }

  //limita as vidas
  if (player.getLifes() < 0) {
    game.addScore(player.getScore());
    game.lost()
    player.reset()
    boss.reset()
  }
}
function moveChefao() {
  if (boss.hasLife()) {
    cont += 1;
    //tiro aleatorio
    boss.shoot();
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
      boss.bullet.getPosition().y >= player.getPosition().y &&
      boss.bullet.getPosition().y - 22 <= player.getPosition().y &&
      boss.bullet.getPosition().x >= player.getPosition().x &&
      boss.bullet.getPosition().x <= player.getPosition().x + 77
    ) {
      player.explosion();
      boss.bullet.getPosition().y = boss.getPosition().y + 108;
      boss.bullet.getPosition().x = boss.getPosition().x + 35;
      player.decreaseLife();
    }

    // colisao do tiro do jogador no boss
    if (
      player.bullet.getPosition().y + 104 >= boss.getPosition().y &&
      player.bullet.getPosition().y - 105 <= boss.getPosition().y &&
      player.bullet.getPosition().x >= boss.getPosition().x &&
      player.bullet.getPosition().x <= boss.getPosition().x + 83
    ) {
      boss.explosion()
      player.bullet.getPosition().y = -500;
      boss.decreaseLife();
    }
  }

  if (!boss.hasLife()) {
    extraLife.moveBackward();

    boss.getPosition().y = -300;
    boss.bullet.setPositionY(boss.getPosition().y);
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
    player.bullet.getPosition().y + 104 >= enemy.getPosition().y &&
    player.bullet.getPosition().y - 105 <= enemy.getPosition().y &&
    player.bullet.getPosition().x >= enemy.getPosition().x - 8 &&
    player.bullet.getPosition().x <= enemy.getPosition().x + 58
  ) {
    enemy.explosion()
    enemy.reset()
    player.increaseScore();
    player.bullet.getPosition().y = -500;
  }
}
function dificuldade() {
  if (player.getScore() >= 0 && player.getScore() < 95) {
    enemy.setSpeed(1);
    game.dificult = "Muito Fácil";
  }
  if (player.getScore() == 95) {
    boss.bullet.setPositionY(boss.getPosition().y);
    boss.bullet.setPositionX(boss.getPosition().x);
    game.challenge();
  } else if (player.getScore() > 100 && player.getScore() <= 240) {
    enemy.setSpeed(2);
    game.dificult = "Fácil";
  }
  if (player.getScore() == 240) {
    boss.getPosition().y = 60;
    boss.bullet.setPositionY(boss.getPosition().y);
    boss.bullet.setPositionX(boss.getPosition().x)
    boss.setBarLife(300);
    game.challenge();
  } else if (player.getScore() > 240 && player.getScore() <= 720) {
    enemy.setSpeed(4);
    game.dificult = "Médio";
  }
  if (player.getScore() == 720) {
    boss.getPosition().y = 60;
    boss.bullet.setPositionY(boss.getPosition().y);
    boss.bullet.setPositionX(boss.getPosition().x);
    boss.setBarLife(400);
    game.challenge();
  } else if (player.getScore() > 720 && player.getScore() <= 1440) {
    enemy.setSpeed(6)
    game.dificult = "Difícil";
  }
  if (player.getScore() == 1440) {
    boss.getPosition().y = 60;
    boss.bullet.setPositionY(boss.getPosition().y);
    boss.bullet.setPositionX(boss.getPosition().x);
    boss.setBarLife(500);
    game.challenge();
  } else if (player.getScore() > 1440) {
    enemy.setSpeed(8);
    game.dificult = "Muito Difícil";
  }
  if (player.getScore() == 2000) {
    boss.getPosition().y = 60;
    boss.bullet.setPositionY(boss.getPosition().y);
    boss.bullet.setPositionX(boss.getPosition().x);
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