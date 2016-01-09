ChillGame.testGameState = function(game){};

ChillGame.testGameState.prototype = {
  // Settings
  // State variables

  create: function(){

    this.map = this.game.add.tilemap('protoBackgroundMap');
    this.map.addTilesetImage('tileset');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.backgroundLayer.resizeWorld();

    this.collisionMap = this.game.add.tilemap('protoCollisionMap');
    this.collisionMap.addTilesetImage('tileset');
    this.collisionLayer = this.collisionMap.createLayer('collisionLayer');
    this.collisionMap.setCollision(1, true, this.collisionLayer);
    this.collisionLayer.visible = false;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = new Player(this, this.game, 10*gridSize, 10*gridSize, 'player');
    this.game.camera.follow(this.player);

    this.keyboard = this.game.input.keyboard;
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
  },

  goToState: function(state){
    this.state.start(state);
  }

}
