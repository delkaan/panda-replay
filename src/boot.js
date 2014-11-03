var Main = {};
var jumped = false;
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var jumpButton;
var explosion;
var goal;
var timeTravelButton;
var restartButton;
var forwardButton;
var backButton;
var numOfResets;
var game;
var sfx_jump;
var sfx_powerup;
var sfx_coin;
var sfx_explosion;
var sfx_fail;
var music_backgound;

//current stage
var stage = 0;
//max stage reached
var maxStage = 0;

var finalStage = 5;

var params;

var crates = [];

var bombs = [];
var Main = {};

var crateGroup;

var timeTravelKey;

Main.Boot = function (game) {
    this.game = game;

};

Main.Boot.prototype = {

    preload: function () {
        game.load.image('Tiles_64x64', 'assets/Tiles_64x64.png');
        game.load.spritesheet('bomb', 'assets/bomb.png', 32, 32);
        game.load.spritesheet('panda', 'assets/panda2.png', 32, 48);
        game.load.spritesheet('crate', 'assets/crate.png', 64, 64);
        game.load.spritesheet('explosion', 'assets/BombExploding.png', 32, 64, 13);
        game.load.spritesheet('wrong', 'assets/wrong.png', 32, 32, 4);
        game.load.image('timeTravelButton', 'assets/E_Metal05.png');
        game.load.image('back', 'assets/back.png');
        game.load.image('forward', 'assets/forward.png');
        game.load.image('restartButton', 'assets/restart.png');
        game.load.image('complete', 'assets/complete.png');
        game.load.audio('sfx_explosion', 'assets/audio/sfx/Explosion.wav');
        game.load.audio('sfx_coin', 'assets/audio/sfx/Pickup_Coin.wav');
        game.load.audio('sfx_jump', 'assets/audio/sfx/Jump.wav');
        game.load.audio('sfx_powerup', 'assets/audio/sfx/Powerup.wav');
        game.load.audio('sfx_fail', 'assets/audio/sfx/Randomize3.wav');
        game.load.audio('music_background', 'assets/audio/music/puzzle-1-b.mp3');
        
        sfx_jump = game.add.audio('sfx_jump');
        sfx_coin = game.add.audio('sfx_coin');
        sfx_explosion = game.add.audio('sfx_explosion');
        sfx_powerup = game.add.audio('sfx_powerup');
        sfx_fail = game.add.audio('sfx_fail');

        music_backgound = game.add.audio('music_background');


    },

    create: function () {
        music_backgound.loop=true;
        music_backgound.play();
        this.game.state.start('stageloader', Main.StageLoader);
    },


}