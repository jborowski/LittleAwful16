var Player = function(conflux, game, x, y, key, group) {
  if(typeof group === 'undefined'){ group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.arcade.enable(this);
  group.add(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;

  this.animations.add('down', [0, 1, 2], 10);
  this.animations.add('left', [3, 4, 5], 10);
  this.animations.add('right', [6, 7, 8], 10);
  this.animations.add('up', [9, 10, 11], 10);
  this.animations.add('standDown', [0]);
  this.animations.add('standLeft', [3]);
  this.animations.add('standRight', [6]);
  this.animations.add('standUp', [9]);

  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.conflux = conflux;

  this.speed = 5*gridSize;

  this.health = 100;

  this.update = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    if(this.cursors.left.isDown){
      this.body.velocity.x = -1*this.speed;
      this.animations.play('left');
    } else if(this.cursors.right.isDown){
      this.body.velocity.x = this.speed;
      this.animations.play('right');
    } else if(this.cursors.up.isDown){
      this.body.velocity.y = -1*this.speed;
      this.animations.play('up');
    } else if(this.cursors.down.isDown){
      this.body.velocity.y = this.speed;
      this.animations.play('down');
    } else {
      this.animations.stop();
    }
  }

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
