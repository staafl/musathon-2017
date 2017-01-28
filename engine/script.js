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

var instrument = "guitar";
var beatIconWidth = 100;
var beatWidth = 200;
var startBeats = 0; // 2 * song.beatsPerMeasure;
var totalBeatsIncludingStart = (startBeats + song.duration) * song.tempo / 60;
// todo: move a bit faster
var beatWidthAndPadding = beatWidth + 100;
var updatesPerBeat = 100;
var click;
var currentBeat;
var currentBar;
var notes;

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
    game.world.setBounds(0, 0, totalBeatsIncludingStart * beatWidth, screen.height);

    game.load.image('sky', 'starfield.png');
    game.load.image('guitarString6', 'string6.PNG');
    game.load.image('guitarString3', 'string3.PNG');
    game.load.image('qNote', 'note.png');
    game.load.image('currentBar', 'currentBar.png');
    game.load.image('measureBar', 'measureBar.png');

    game.load.audio('woodclick', 'woodclick.ogg');
}

function addGuitarString(number) {

    var guitarString = game.add.tileSprite(
      0,
      guitarStringToY[number],
      totalBeatsIncludingStart * beatWidth,
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

    click = game.add.audio('woodclick');

    game.add.tileSprite(
        0,
        0,
        totalBeatsIncludingStart * beatWidth,
        screen.height,
        'sky');

    for (var ii = 0; ii < 6; ++ii) {
        addGuitarString(ii + 1);
    }

    time = 0;

    while (time < totalBeatsIncludingStart) {

        if (time % song.beatsPerMeasure == 0) {
            var measureBar =
                game.add.sprite(
                    time * beatWidthAndPadding,
                    guitarStringToY[1] + 1,
                    'measureBar');
        }

        time += 1;
    }

    if (instrument = "guitar") {
        var notes = [];
        for (var bix in song.parts.guitar) {

            var item = song.parts.guitar[bix];

            for (var nix in item.notes) {

                var note = item.notes[nix];

                if (!isNaN(note[0])) {
                    var noteSprite =
                            game.add.sprite(
                                (startBeats + item.startTime) * beatWidthAndPadding,
                                guitarStringToY[note[0]] - 9,
                                'qNote');
                    noteSprite.scale.setTo((beatWidth / beatIconWidth) * item.beats, 1);
                }
            }
        }
    }

    currentBar =
        game.add.sprite(
            0,
            0,
            'currentBar');

    currentBar.scale.setTo(2, 2);
    var cycle = 0;
    currentBeat = -1;
    game.time.events.loop(
        (60000 / song.tempo) /* duration of beat in ms */ / updatesPerBeat,
        function() {
            if (cycle % updatesPerBeat == 0) {
                currentBeat += 1;
                setTimeout(onBeat, 1);
            }
            game.camera.x += beatWidthAndPadding / updatesPerBeat;
            if (currentBar)
                currentBar.x = game.camera.x + beatWidthAndPadding;
            cycle += 1;
        },
        true);
}

function onBeat() 
{
    click.play();
    
}

function update() {


}

function render() {

}