ChillGame.testGameState = function(game){};

ChillGame.testGameState.prototype = {
  // Settings
  // State variables

  create: function(){

    this.game.stage.backgroundColor = '#000000';

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
    this.totem1 = new Totem(this, this.game, 60*gridSize, 64*gridSize, 'totem', this.totems);
    this.totem2 = new Totem(this, this.game, 21*gridSize, 41*gridSize, 'totem', this.totems);
    this.totem3 = new Totem(this, this.game, 6*gridSize, 18*gridSize, 'totem', this.totems);
    this.totem4 = new Totem(this, this.game, 37*gridSize, 22*gridSize, 'totem', this.totems);
    this.totem5 = new Totem(this, this.game, 67*gridSize, 22*gridSize, 'totem', this.totems);
    this.totem6 = new Totem(this, this.game, 91*gridSize, 29*gridSize, 'totem', this.totems);

    this.gate = this.game.add.sprite(46*gridSize, 10*gridSize-28, 'gate');
    this.game.physics.arcade.enable(this.gate);
    this.gate.body.immovable = true;

    this.endDude = this.game.add.sprite(48*gridSize, 5*gridSize, 'player');
    this.game.physics.arcade.enable(this.endDude);
    this.endDude.body.immovable = true;
    this.endDude.frame = 1;
    this.endDude.anchor.setTo(0.5, 0.5);

    this.maskGraphics = this.game.add.graphics(0, 0);
    this.backgroundLayer.mask = this.maskGraphics;
    this.totems.mask = this.maskGraphics;
    this.gate.mask = this.maskGraphics;

    this.player = new Player(this, this.game, 50*gridSize, 92*gridSize, 'player');
    this.game.camera.follow(this.player);

    this.fog = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'fogOverlay');
    this.fog.alpha = 0.75;
    this.fog.mask = this.maskGraphics;

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

    //this.debugText = this.game.add.text(5, 50, 'DEBUG INFO\n', { fontSize: '10px', fill: '#FFF' });
    //this.debugText.fixedToCamera = true;

    this.wind = this.game.add.audio('wind', 0.4, true);
    this.wind.play();

    this.coldSound = this.game.add.audio('cold', 0, true);
    this.coldSound.play();

    this.totemSound = this.game.add.audio('totem', 1, false);

    this.finalMusic = this.game.add.audio('finalMusic', 0.4, false);

    if (firstLoad) {
      this.title = this.game.add.sprite(this.game.camera.x, this.game.camera.y + 2*gridSize, 'title');
      this.titleTween = this.game.add.tween(this.title).to( { alpha: 0 }, 3000, "Linear", true);
      this.titleTween.onComplete.add(function(){this.title.kill()}, this);
    }

    firstLoad = false;

  },

  update: function(){
    if(this.player.health <= 1){
      this.wind.stop();
      this.coldSound.stop();
      this.player.steps.stop();
      this.player.blocked = true;
      this.goToState('failState');
    }

    this.title.x = this.camera.x;
    this.title.y = this.camera.y + 2*gridSize;

    this.gate.frame = this.player.totemsFound;
    if (this.player.totemsFound == 6){
      this.gate.kill();
      this.player.totemsFound = 0;
    }

    if (this.game.physics.arcade.distanceBetween(this.endDude, this.player) <= 1*gridSize){
      this.player.blocked = true;
      this.finalTween = this.game.add.tween(this.game.world).to( {alpha: 0}, 5000, "Linear", true);
      this.game.add.tween(this.wind).to( {volume: 0}, 5000, "Linear", true);
      this.finalMusic.play();
    }

    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.totems);
    this.game.physics.arcade.collide(this.player, this.gate);

    this.whiteout.x = this.player.x+10;
    this.whiteout.y = this.player.y+20;
    this.fog.tilePosition.x += 0.5;
    this.whiteout.alpha = (101 - this.player.health) / 100;
    this.coldSound.volume = 0;
    this.wind.volume = 0.4;
    if(this.player.health < 50){
      this.wind.volume = (this.player.health / 50) * 0.4;
      this.coldSound.volume = ((50 - this.player.health) / 50) * 0.1;
    }

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
    //this.debugText.text = "Player "+this.player.debugText()+"\n";
  },

  goToState: function(state){
    this.state.start(state);
  }

}
