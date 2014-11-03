Main.Game = function (game) {
    this.game = game;

};
Main.Game.prototype = {

    preload: function () {


    },

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#6495ED';

        map = game.add.tilemap('stage' + stage);

        map.addTilesetImage('Tiles_64x64');
        map.addTilesetImage('bomb');
        map.setCollisionByExclusion([98, 99, 100]);

        layer = map.createLayer('Ground');

        layer.resizeWorld();

        game.physics.arcade.gravity.y = 250;

        player = game.add.sprite(params.playerx, params.playery, 'panda');

        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 30, 5, 22);
        player.scale.set(1.2);

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        numOfResets = params.resets;

        init(params);
        timeTravelButton = this.game.add.button(this.game.width - 32, this.game.height - 32, 'timeTravelButton', timeTravel);
        restartButton = this.game.add.button(this.game.width - 24, 0, 'restartButton', restart);

        timeTravelKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        timeTravelKey.onDown.add(timeTravel, this);

        timeTravelKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        timeTravelKey.onDown.add(timeTravel, this);

        if (stage > 0)
            backButton = this.game.add.button(this.game.width - 72, 0, 'back', back);

        if (maxStage > stage)
            forwardButton = this.game.add.button(this.game.width - 48, 0, 'forward', forward);

        goal = game.add.sprite(params.goalx, params.goaly, 'bomb', 2);
        game.physics.enable(goal, Phaser.Physics.ARCADE);
        goal.body.collideWorldBounds = true;
        
        if(stage == finalStage){
            game.add.sprite(280, 400, 'complete', 0);
        }

    },
    update: function () {
        var p2 = game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(goal, layer);
        var goalReached = game.physics.arcade.collide(player, goal);
        if (goalReached) {
            sfx_coin.play();
            goal.kill();
            stage++;
            game.state.start('stageloader', Main.StageLoader);
        }

        $.each(bombs, function (i, bomb) {
            if (bomb != null) {


                $.each(crates, function (i, crate) {
                    var result = game.physics.arcade.collide(crate, bomb);


                });

                bomb.body.velocity.x = 0;
                game.physics.arcade.collide(bomb, player);
                game.physics.arcade.collide(bomb, layer);
            }
        });
        $.each(crates, function (i, crate) {
            if (crate != null) {
                crate.body.velocity.x = 0;
            }
        });

        goal.body.velocity.x = 0;
        game.physics.arcade.collide(crateGroup);
        game.physics.arcade.collide(player, crateGroup);
        game.physics.arcade.collide(crateGroup, layer);
        game.physics.arcade.collide(crateGroup, goal);
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -150;

            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;

            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        } else {
            if (facing != 'idle') {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 0;
                } else {
                    player.frame = 5;
                }

                facing = 'idle';
            }
        }
        if ((cursors.up.isDown || jumpButton.isDown) && (player.body.onFloor() || player.body.touching.down || !jumped) && game.time.now > jumpTimer) {
            player.body.velocity.y = -200;
            jumpTimer = game.time.now + 750;
            jumped = true;
            sfx_jump.play();
        }
    },
    render: function () {
        $.each(bombs, function (i, bomb) {
            if (bomb != null) {
                var duration = bomb.timer.timer.duration;
                game.debug.text(duration / 1000, bomb.x, bomb.y);

                if (duration < 1000) {

                    bomb.animations.play('explosion', 8, false);
                }
            }


        });




        if (numOfResets >= 0) {
            game.debug.text("Time travel remaining: " + numOfResets, this.game.width - 280, this.game.height - 10);
        }


        game.debug.text("Stage " + (stage + 1), 0, this.game.height - 10);
    }


}

function init(params) {
    $.each(params.bombs, function (i, item) {
        var bomb = game.add.sprite(item.x, item.y, 'explosion', 0);
        game.physics.enable(bomb, Phaser.Physics.ARCADE);
        bomb.body.bounce.y = 0.2;
        bomb.body.collideWorldBounds = true;
        bomb.body.setSize(25, 25, 5, 32);

        timer = game.time.create(false);

        bomb.timer = timer.loop(Phaser.Timer.SECOND * item.timer, function () {
            explode(i);
        }, this);
        timer.start();
        bomb.animations.add('explosion');
        bombs[i] = bomb;



    });
    crateGroup = game.add.group();
    $.each(params.crates, function (i, item) {
        var crate;
        if (item.immovable != null && item.immovable == false) {
            crate = game.add.sprite(item.x, item.y, 'crate', 0);
        } else {
            crate = game.add.sprite(item.x, item.y, 'crate', 1);
        }

        game.physics.enable(crate, Phaser.Physics.ARCADE);
        crate.body.bounce.y = 0.2;
        crate.body.collideWorldBounds = true;
        crate.body.setSize(64, 64);
        crate.body.immovable = item.immovable;
        crateGroup.add(crate);
        crates.push(crate);
    });


}

function collides(a, b) {
    if (a != undefined) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
}

function almostCollides(a, b) {
    if (a != undefined) {
        return !(
            ((a.y + a.height) < (b.y - 25)) ||
            (a.y - 25 > (b.y + b.height)) ||
            ((a.x + a.width) < b.x - 25) ||
            (a.x - 25 > (b.x + b.width))
        );
    }
}

function restart() {
    game.state.start('stageloader', Main.StageLoader);
}

function back() {
    stage--;
    game.state.start('stageloader', Main.StageLoader);
}

function forward() {
    stage++;
    game.state.start('stageloader', Main.StageLoader);
}

function timeTravel() {
    if (numOfResets > 0) {
        //validate
        var passesValidation = true;
        $.each(params.crates, function (i, crate) {

            var tmp = game.add.sprite(crate.x, crate.y, 'crate', 6);

            if (collides(tmp, player)) {
                passesValidation = false;
            }

            tmp.kill();

        });



        if (passesValidation) {
            //destroy all
            sfx_powerup.play();
            $.each(bombs, function (i, bomb) {

                if (bomb != null) {
                    bomb.timer.timer.removeAll();
                    bomb.kill();
                }
            });
            $.each(crates, function (i, crate) {
                if (crate != null)
                    crate.kill();
            });




            init(params);
            numOfResets--;
        } else {
            var wrong = game.add.sprite(player.x, player.y + 25, 'wrong', 0);
            var anim = wrong.animations.add('wrong');
            anim.play(8, false, true);
            sfx_fail.play();
            //wrong.kill();
        }
    }

}

function explode(index) {

    var bomb = bombs[index];

    if (bomb != null) {
        sfx_explosion.play();
        //see which crates the bomb touches
        $.each(crates, function (i, crate) {
            if (almostCollides(crate, bomb))
                crate.kill();
        });
        bomb.timer.timer.removeAll();
        bomb.kill();
        bombs[index] = null;

    }


    return true;

}