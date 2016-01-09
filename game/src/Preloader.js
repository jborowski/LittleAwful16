ChillGame.Preloader = function (game) {
  this.loadBackground = null;
  this.preloadBar = null;
  this.SAlogo = null;
  this.loadingText = null;
  this.ready = false;
};

ChillGame.Preloader.prototype = {

  preload: function () {
    this.preloadBar = this.add.sprite(209, 356, 'loadBar');
    this.SAlogo = this.add.sprite(width/2, height/2, 'SAGDlogo');
    this.SAlogo.anchor.setTo(0.5, 0.5);
    // this.loadingText = this.add.text(240, 450, 'now loading');

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.tilemap('protoBackgroundMap', 'data/Levels/proto/backgroundLayer.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('protoCollisionMap', 'data/Levels/proto/collisionLayer.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('tileset', 'assets/tileset.png');

    this.game.load.spritesheet('player', 'assets/proto_pc.png', 40, 40);
    //this.game.load.text('level1Spawns', 'data/levels/Act-1/spawns.json');
    //this.game.load.audio('sfx', ['assets/sfx/sfx.ogg']);
    //music = this.game.add.audio('music');
    //this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function () {
    this.preloadBar.cropEnabled = false;
  },

  update: function () {
    /* if (this.cache.isSoundDecoded('music') && this.ready == false) {
      this.ready = true;
      this.state.start('Intro'); */
    this.state.start('testGameState');
    // }
  }
};
