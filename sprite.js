function Sprite(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xcanvas, ycanvas) {
    contexto.drawImage(
      img,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xcanvas,
      ycanvas,
      this.largura,
      this.altura
    );
  };
}
var personagem = new Sprite(16, 16, 77, 121);
var Bala = new Sprite(49, 249, 8, 22);
var audi = new Sprite(308, 7, 45, 97);
var carroPreto = new Sprite(383, 11, 43, 96);
var expl = new Sprite(172, 146, 55, 45);
var taxi = new Sprite(215, 17, 51, 100);
var carro = new Sprite(445, 10, 42, 97);
var bossD = new Sprite(256, 133, 83, 108);
var BalaBoss = new Sprite(77, 247, 8, 22);
var maleta = new Sprite(169, 221, 55, 52);
var fundo = new Sprite(500, 0, 500, 500);
