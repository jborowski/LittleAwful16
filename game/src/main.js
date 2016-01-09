window.onload = function(){

  var game = new Phaser.Game(width, height, Phaser.CANVAS, document.getElementById("main"));

  WebFontConfig = {
    google: {
      families: ['Lato']
    }
  };

  var music = null;
  var ambience;
  var sfx;

  game.state.add('Boot', ChillGame.Boot);
  game.state.add('Preloader', ChillGame.Preloader)
  game.state.add('GameTest', ChillGame.testGameState);
  game.state.start('Boot');
}
