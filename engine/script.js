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

var beatWidth = 200;
var startBeats = 2 * song.beatsPerMeasure;
var totalBeats = (startBeats + song.duration) * song.tempo / 60;

var guitarStringToY =
{
    1: 170,
    2: 250,
    3: 330,
    4: 410,
    5: 490,
    6: 570
};

function preload() {

    /* TODO: base on tempo so quarter is always same */
    game.world.setBounds(0, 0, totalBeats * beatWidth, screen.height);

    game.load.image('sky', 'starfield.png');
    game.load.image('guitarString6', 'string6.PNG');
    game.load.image('guitarString3', 'string3.PNG');
    game.load.image('qNote', 'note.png');
    game.load.image('currentBar', 'currentBar.png');
    game.load.image('measureBar', 'measureBar.png');

}

function addGuitarString(number) {

    var guitarString = game.add.tileSprite(
      0,
      guitarStringToY[number],
      totalBeats * beatWidth,
      number > 3 ? 11 : 4,
      number > 3 ? 'guitarString6' : 'guitarString3');

    switch (number) {
        case 1:
            guitarString.scale.setTo(1, 0.60);
            break;
        case 2:
            guitarString.scale.setTo(1, 0.80);
            break;
        case 4:
            guitarString.scale.setTo(1, 0.30);
            break;
        case 5:
            guitarString.scale.setTo(1, 0.40);
            break;
                case 6:
            guitarString.scale.setTo(1, 0.50);
            break;
    }
//
//    var guitarString2 = game.add.tileSprite(
//        0,
//        280,
//        beats * beatWidth,
//        5,
//        'guitarString3');
//    guitarString2.scale.setTo(1, 0.74);
//
//    game.add.tileSprite(
//        0,
//        360,
//        beats * beatWidth,
//        5,
//        'guitarString3');
//
//    var guitarString4 = game.add.tileSprite(
//        0,
//        440,
//        beats * beatWidth,
//        11,
//        'guitarString6');
//
//    guitarString4.scale.setTo(1, 0.74);
//
//    var guitarString5 = game.add.tileSprite(
//        0,
//        520,
//        beats * beatWidth,
//        11,
//        'guitarString6');
//
//    guitarString5.scale.setTo(1, 0.88);
//
//    var guitarString6 = game.add.tileSprite(
//        0,
//        600,
//        beats * beatWidth,
//        11,
//        'guitarString6');
}

function create() {

    game.add.tileSprite(
        0,
        0,
        totalBeats * beatWidth,
        screen.height,
        'sky');

    for (var ii = 0; ii < 6; ++ii) {
        addGuitarString(ii + 1);
    }


    var time = startBeats;
        
    for (var bix in song.parts.guitar) {

        var beat = song.parts.guitar[bix];

        for (var nix in beat.notes) {

            var note = beat.notes[nix];

            if (!isNaN(note[0])) {
                var noteSprite =
                        game.add.sprite(
                            time * (beatWidth + 5) + 20,
                            guitarStringToY[note[0]] - 9,
                            'qNote');
                noteSprite.scale.setTo(beat.beats, 1);
            }
        }
    }
    
    time = startBeats / 2;
    
    while (time < totalBeats) {

        if (time % song.beatsPerMeasure == 0) {
            var measureBar =
                game.add.sprite(
                    time * (beatWidth + 5),
                    guitarStringToY[1] + 1,
                    'measureBar');
        }

        time += 1;
    }
    
    currentBar =
        game.add.sprite(
            1 * (beatWidth + 5),
            0,
            'currentBar');
    
    currentBar.scale.setTo(2, 2);
}

var currentBar;

window.onload = function() {



    setInterval(
        function() {
            game.camera.x += beatWidth / 100;
            if (currentBar)
            currentBar.x = game.camera.x + beatWidth + 5; 
        },
        10 * (60 / song.tempo));
};

function update() {


}

function render() {

}