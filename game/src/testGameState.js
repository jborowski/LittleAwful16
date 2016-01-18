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

    this.maskGraphics = this.game.add.graphics(0, 0);
    this.backgroundLayer.mask = this.maskGraphics;
    this.totems.mask = this.maskGraphics;

    this.player = new Player(this, this.game, 50*gridSize, 90*gridSize, 'player');
    this.game.camera.follow(this.player);

    this.whiteout = this.game.add.sprite(this.player.x+20, this.player.y+20, 'whiteOverlay');
    this.whiteout.anchor.setTo(0.5, 0.5);
    this.whiteout.alpha = 0;

    this.totems.forEach(function(item){
      item.glowToTop();
    }, this);

    this.sightAngle = Math.PI/2;
	  this.numberOfRays = 50;
	  this.rayLength = 4*gridSize;

    this.keyboard = this.game.input.keyboard;

    this.debugText = this.game.add.text(5, 50, 'DEBUG INFO\n', { fontSize: '10px', fill: '#FFF' });
    this.debugText.fixedToCamera = true;

  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.totems);

    this.whiteout.x = this.player.x+20;
    this.whiteout.y = this.player.y+20;
    this.whiteout.alpha = (101 - this.player.health) / 100;

    this.maskGraphics.clear();

    this.maskGraphics.lineStyle(2, 0x000000, 1);
    this.maskGraphics.beginFill(0xffff00);
    this.maskGraphics.drawCircle(this.player.x+20, this.player.y+20, 5*gridSize);
    this.maskGraphics.moveTo(this.player.x+20, this.player.y+20);
		for(var i = 0; i<this.numberOfRays; i++){

			var rayAngle = this.player.facing-(this.sightAngle/2)+(this.sightAngle/this.numberOfRays)*i
			var lastX = this.player.x;
			var lastY = this.player.y;
			for(var j= 1; j<=this.rayLength;j+=1){
        var landingX = Math.round(this.player.x-(2*j)*Math.cos(rayAngle));
        var landingY = Math.round(this.player.y-(2*j)*Math.sin(rayAngle));
        if(!this.collisionMap.hasTile(Math.floor(landingX/gridSize), Math.floor(landingY/gridSize), 'collisionLayer')){
					lastX = landingX;
					lastY = landingY;
				}
				else {
					this.maskGraphics.lineTo(lastX, lastY);
					break;
				}
			}
		  this.maskGraphics.lineTo(landingX,landingY);
    }
    this.maskGraphics.lineTo(this.player.x+20, this.player.y+20);
    this.maskGraphics.endFill();
    this.debugText.text = "Player "+this.player.debugText()+"\n";
  },

  goToState: function(state){
    this.state.start(state);
  }

}
