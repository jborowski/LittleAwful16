var Totem = function(conflux, game, x, y, key, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  this.glow = game.add.sprite(x, y, 'totemGlow');
  this.glow.anchor.setTo(0.5, 0.5);
  this.glow.alpha = 0;
  group.add(this);
  game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.anchor.setTo(0.5, 0.5);

  this.conflux = conflux;

  this.active = false;
  this.playerProximity = 100*gridSize;

  this.update = function(){
    this.playerProximity = game.physics.arcade.distanceBetween(conflux.player, this);
    if(!this.active && (this.playerProximity < 2*gridSize)){
      this.active = true;
      game.add.tween(this.glow).to( { alpha: 0.5 }, 1000, "Linear", true);
    }
    if(this.active && (this.playerProximity < 5*gridSize) && conflux.player.health < 100){
      conflux.player.health += 0.4
    }
  }

  this.glowToTop = function(){
      game.world.bringToTop(this.glow);
  }

}

Totem.prototype = Object.create(Phaser.Sprite.prototype);
Totem.prototype.constructor = Totem;
