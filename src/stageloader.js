Main.StageLoader = function (game) {
    this.game = game;

};

Main.StageLoader.prototype = {

    preload: function () {
        game.load.tilemap('stage' + stage, 'assets/stages/stage' + stage + '.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function () {

        params = (function () {
            var json = null;


            $.ajax({
                dataType: "json",
                url: "assets/stages/stage" + stage + "obj.json",
                mimeType: "application/json",
                async: false,
                success: function (data) {
                    json = data;
                }
            });

            return json[0];
        })();

        crates = [];

        bombs = [];

        if (stage > maxStage) {
            maxStage = stage;
        }

        this.game.state.start('game', Main.Game);
    },


}