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
    this.game.load.image('whiteOverlay', 'assets/overlay_white.png');
    this.game.load.image('totemGlow', 'assets/totem_glow.png');
    this.game.load.image('fogOverlay', 'assets/fog.png');
    this.game.load.image('title', 'assets/title.png');

    this.game.load.spritesheet('player', 'assets/pc.png', 21, 38);
    this.game.load.spritesheet('totem', 'assets/totem.png', 80, 120);
    this.game.load.spritesheet('gate', 'assets/gate.png', 160, 80);

    //this.game.load.text('level1Spawns', 'data/levels/Act-1/spawns.json');
    this.game.load.audio('wind', ['assets/wind.ogg']);
    this.game.load.audio('cold', ['assets/cold.ogg']);
    this.game.load.audio('totem', ['assets/totem.ogg']);
    this.game.load.audio('steps', ['assets/step.ogg']);
    this.game.load.audio('finalMusic', ['assets/finalmusic.ogg']);
    //this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function () {
    this.preloadBar.cropEnabled = false;
  },

  update: function () {
    if (this.cache.isSoundDecoded('wind') && this.ready == false) {
      this.ready = true;
      this.state.start('testGameState');
    }
  }
};
