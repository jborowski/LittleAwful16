ChillGame.GameState = function(game){};

ChillGame.GameState.prototype = {
  // Settings
  // State variables

  create: function(){
    // reset background color to black
    this.game.stage.backgroundColor = '#000000';

    // load tilemap
    this.map = this.game.add.tilemap('protoBackgroundMap');
    this.map.addTilesetImage('tileset');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.backgroundLayer.resizeWorld();

    // load collision map
    this.collisionMap = this.game.add.tilemap('protoCollisionMap');
    this.collisionMap.addTilesetImage('tileset');
    this.collisionLayer = this.collisionMap.createLayer('collisionLayer');
    this.collisionMap.setCollision(1, true, this.collisionLayer);
    this.collisionLayer.visible = false;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // horribly hardcode totems on the map
    this.totems = this.game.add.group();
    this.totem1 = new Totem(this, this.game, 60*gridSize, 64*gridSize, 'totem', this.totems);
    this.totem2 = new Totem(this, this.game, 21*gridSize, 41*gridSize, 'totem', this.totems);
    this.totem3 = new Totem(this, this.game, 6*gridSize, 18*gridSize, 'totem', this.totems);
    this.totem4 = new Totem(this, this.game, 37*gridSize, 22*gridSize, 'totem', this.totems);
    this.totem5 = new Totem(this, this.game, 67*gridSize, 22*gridSize, 'totem', this.totems);
    this.totem6 = new Totem(this, this.game, 91*gridSize, 29*gridSize, 'totem', this.totems);

    // horribly hardcode the final gate on the map
    this.gate = this.game.add.sprite(46*gridSize, 10*gridSize-28, 'gate');
    this.game.physics.arcade.enable(this.gate);
    this.gate.body.immovable = true;

    // horribly hardcode the person on the other side of the gate
    this.endDude = this.game.add.sprite(48*gridSize, 5*gridSize, 'player');
    this.game.physics.arcade.enable(this.endDude);
    this.endDude.body.immovable = true;
    this.endDude.frame = 1;
    this.endDude.anchor.setTo(0.5, 0.5);

    // add ray casting mask graphics
    this.maskGraphics = this.game.add.graphics(0, 0);
    this.backgroundLayer.mask = this.maskGraphics;
    this.totems.mask = this.maskGraphics;
    this.gate.mask = this.maskGraphics;

    // add player in starting position, make camera follow
    this.player = new Player(this, this.game, 50*gridSize, 92*gridSize, 'player');
    this.game.camera.follow(this.player);

    // add fog overlay
    this.fog = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'fogOverlay');
    this.fog.alpha = 0.75;
    this.fog.mask = this.maskGraphics;

    // add white freezing overlay
    this.whiteout = this.game.add.sprite(this.player.x+20, this.player.y+20, 'whiteOverlay');
    this.whiteout.anchor.setTo(0.5, 0.5);
    this.whiteout.alpha = 0;

    // move totem light child sprites to top of the game world
    this.totems.forEach(function(item){
      item.glowToTop();
    }, this);

    // constants of the ray casting algorthm
    this.sightAngle = Math.PI/2;
	  this.numberOfRays = 50;
	  this.rayLength = 4*gridSize;

    // set input
    this.keyboard = this.game.input.keyboard;

    // debug info
    //this.debugText = this.game.add.text(5, 50, 'DEBUG INFO\n', { fontSize: '10px', fill: '#FFF' });
    //this.debugText.fixedToCamera = true;

    // set up SFX
    this.wind = this.game.add.audio('wind', 0.4, true);
    this.wind.play();

    this.coldSound = this.game.add.audio('cold', 0, true);
    this.coldSound.play();

    this.totemSound = this.game.add.audio('totem', 1, false);

    this.finalMusic = this.game.add.audio('finalMusic', 0.4, false);

    // show the game title sprite if the state is being run for the first time
    if (firstLoad) {
      this.title = this.game.add.sprite(this.game.camera.x, this.game.camera.y + 2*gridSize, 'title');
      this.titleTween = this.game.add.tween(this.title).to( { alpha: 0 }, 3000, "Linear", true);
      this.titleTween.onComplete.add(function(){this.title.kill()}, this);
    }

    // reset the variable, so the title screen is not shown after each respawn
    firstLoad = false;

  },

  update: function(){

    // player dies
    if(this.player.health <= 1){
      this.wind.stop();
      this.coldSound.stop();
      this.player.steps.stop();
      this.player.blocked = true;
      this.goToState('failState');
    }

    // make title screen follow player
    this.title.x = this.camera.x;
    this.title.y = this.camera.y + 2*gridSize;

    // update the gate to show amount of collected totems
    this.gate.frame = this.player.totemsFound;
    if (this.player.totemsFound == 6){
      // destroy gate if all totems are collected
      this.gate.kill();
      this.player.totemsFound = 0;
    }

    // trigger ending if player approaches end dude
    if (this.game.physics.arcade.distanceBetween(this.endDude, this.player) <= 1*gridSize){
      this.player.blocked = true;
      this.finalTween = this.game.add.tween(this.game.world).to( {alpha: 0}, 5000, "Linear", true);
      this.game.add.tween(this.wind).to( {volume: 0}, 5000, "Linear", true);
      this.finalMusic.play();
    }

    // process collisions
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.player, this.totems);
    this.game.physics.arcade.collide(this.player, this.gate);

    // make freezing overlay follow player
    this.whiteout.x = this.player.x+10;
    this.whiteout.y = this.player.y+20;

    // scroll fog
    this.fog.tilePosition.x += 0.5;

    // set whiteout visibility
    this.whiteout.alpha = (101 - this.player.health) / 100;
    // reset the horrible noise
    this.coldSound.volume = 0;
    // reset wind noise
    this.wind.volume = 0.4;

    // if player health below 50% wind fades out and is gradually replaced by horrible sine noise
    if(this.player.health < 50){
      this.wind.volume = (this.player.health / 50) * 0.4;
      this.coldSound.volume = ((50 - this.player.health) / 50) * 0.1;
    }

    // reset ray casting mask
    this.maskGraphics.clear();

    // draw the rays
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

    // debug - display player health value
    //this.debugText.text = "Player "+this.player.debugText()+"\n";
  },

  goToState: function(state){
    // self-explanatory
    this.state.start(state);
  }

}
