var Player = function(conflux, game, x, y, key, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.arcade.enable(this);
  group.add(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;
  this.body.setSize(22, 20, 0, 18);

  this.animations.add('down', [0, 1, 2], 5);
  this.animations.add('left', [3, 4, 5], 5);
  this.animations.add('right', [6, 7, 8], 5);
  this.animations.add('up', [9, 10, 11], 5);
  this.animations.add('standDown', [0]);
  this.animations.add('standLeft', [3]);
  this.animations.add('standRight', [6]);
  this.animations.add('standUp', [9]);

  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.conflux = conflux;

  this.speed = 2*gridSize;

  this.health = 100;

  this.facing = Math.PI/2;

  this.totemsFound = 0;

  this.blocked = false;

  this.steps = this.game.add.audio('steps', 0.15, true);

  this.update = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    if(this.health > 0 && this.y >= gridSize*10){
      this.health -= 0.025;
    }
    if (!this.steps.isPlaying){
      this.steps.play();
    }
    if(!this.blocked && this.cursors.left.isDown){
      this.body.velocity.x = -1*this.speed;
      this.animations.play('left');
      this.facing = 0;
    } else if(!this.blocked && this.cursors.right.isDown){
      this.body.velocity.x = this.speed;
      this.animations.play('right');
      this.facing = Math.PI;
    } else if(!this.blocked && this.cursors.up.isDown){
      this.body.velocity.y = -1*this.speed;
      this.animations.play('up');
      this.facing = Math.PI/2;
    } else if(!this.blocked && this.cursors.down.isDown){
      this.body.velocity.y = this.speed;
      this.animations.play('down');
      this.facing = Math.PI*3/2;
    } else {
      this.animations.stop();
      this.steps.stop();
    }
  }

  this.debugText = function(){
    return "Health: " + String(this.health);
  }

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
