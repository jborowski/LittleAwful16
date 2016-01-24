ChillGame.failState = function(game){};

ChillGame.failState.prototype = {

  create: function(){
    // 3 seconds delay, after which return to game state
    this.game.stage.backgroundColor = '#ffffff';
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.restart, this);
  },

  restart: function(){
    this.state.start('GameState');
  }

}
