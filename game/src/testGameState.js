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

    this.totems = this.game.add.group();
    this.totem1 = new Totem(this, this.game, 60*gridSize, 52*gridSize, 'totem', this.totems);
    this.totem2 = new Totem(this, this.game, 91*gridSize, 70*gridSize, 'totem', this.totems);
    this.totem3 = new Totem(this, this.game, 21*gridSize, 30*gridSize, 'totem', this.totems);
    this.totem4 = new Totem(this, this.game, 37*gridSize, 12*gridSize, 'totem', this.totems);
    this.totem5 = new Totem(this, this.game, 6*gridSize, 6*gridSize, 'totem', this.totems);

    this.player = new Player(this, this.game, 50*gridSize, 90*gridSize, 'player');
    this.game.camera.follow(this.player);

    this.keyboard = this.game.input.keyboard;

    this.debugText = this.game.add.text(5, 50, 'DEBUG INFO\n', { fontSize: '10px', fill: '#000' });
    this.debugText.fixedToCamera = true;
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.totems);
    this.debugText.text = "Player "+this.player.debugText()+"\n";
  },

  goToState: function(state){
    this.state.start(state);
  }

}
