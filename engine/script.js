var game = new Phaser.Game(
    screen.width,
    screen.height,
    Phaser.CANVAS,
    'phaser-example',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

var beatWidth = 50;
var beats = song.duration * song.tempo / 60;

function preload() {

    /* TODO: base on tempo so quarter is always same */
    game.world.setBounds(0, 0, beats * beatWidth, screen.height);

    game.load.image('sky', 'sky-2x.png');
    game.load.image('string6', 'string6.PNG');
    game.load.image('qNote', 'twitter-photonstorm.png');
//    game.load.image('wNote', 'assets/sprites/wNote.png');
//    game.load.image('hNote', 'assets/sprites/hNote.png');
//    game.load.image('qNote', 'assets/sprites/qNote.png');
//    game.load.image('eNote', 'assets/sprites/eNote.png');
//    game.load.image('sNote', 'assets/sprites/sNote.png');


}

function create() {

    game.add.tileSprite(
        0,
        0,
        beats * beatWidth,
        screen.height,
        'sky');

    var string4 = game.add.tileSprite(
        0,
        440,
        beats * beatWidth,
        11,
        'string6');
    string4.scale.setTo(1, 0.74);

    var string5 = game.add.tileSprite(
        0,
        520,
        beats * beatWidth,
        11,
        'string6');
    string5.scale.setTo(1, 0.88);

    var string6 = game.add.tileSprite(
        0,
        600,
        beats * beatWidth,
        11,
        'string6');

    var time = 0;
    time = 10;
    for (var bix in song.parts.guitar) {

        var beat = song.parts.guitar[bix];

        for (var nix in beat.notes) {

            var note = beat.notes[nix];

            if (!isNaN(note[0])) {
                game.add.sprite(
                    time * beatWidth,
                    note[0] * 100,
                    'qNote');
            }
        }

        time += beat.beats;
    }
}

window.onload = function() {



    setInterval(
        function() {
            game.camera.x += beatWidth;
        },
        1000 * (60 / song.tempo));
};

function update() {


}

function render() {

}