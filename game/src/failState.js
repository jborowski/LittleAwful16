ChillGame.failState = function(game){};

ChillGame.failState.prototype = {
  // Settings
  // State variables

  create: function(){
    this.game.stage.backgroundColor = '#ffffff';
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.restart, this);
  },

  restart: function(){
    this.state.start('testGameState');
  }

}
