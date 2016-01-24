window.onload = function(){

  var game = new Phaser.Game(width, height, Phaser.CANVAS, document.getElementById("main"));

  game.state.add('Boot', ChillGame.Boot);
  game.state.add('Preloader', ChillGame.Preloader)
  game.state.add('GameState', ChillGame.GameState);
  game.state.add('failState', ChillGame.failState);
  game.state.start('Boot');
}
