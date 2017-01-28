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
var beatWidth = 150;
var startBeats = 1 * song.beatsPerMeasure;
var totalBeatsIncludingStart = (startBeats + song.duration) * song.tempo / 60;
var beatWidthAndPadding = beatWidth + 50;
var totalWidth = (1 + totalBeatsIncludingStart) * beatWidthAndPadding;
// todo: move a bit faster
var updatesPerBeat = 100;
var click;
var currentBeat;
var currentBar;
var notes;
var playItems = {};
var sounds = {};

var guitarStringToY =
{
    1: 170,
    2: 250,
    3: 330,
    4: 410,
    5: 490,
    6: 570
};

function stringAndFretToPitch(s, f, a)
{
    var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    var strings = ['E','B','G','D','A','E'];
    var stringOctave = [4, 3, 3, 3, 2, 2];
    var indexOf = notes.indexOf(strings[s - 1]);
    var toReturn = notes[(indexOf + f) % notes.length];
    toReturn += (stringOctave[s-1] + Math.floor((f + indexOf) / 12) + (a || 0));
    return toReturn;
}

function preload() {

    game.world.setBounds(0, 0, totalWidth, screen.height);

    game.load.image('sky', 'resources/starfield.png');
    game.load.image('guitarString6', 'resources/string6.PNG');
    game.load.image('guitarString3', 'resources/string3.PNG');
    game.load.image('qNote', 'resources/note.png');
    game.load.image('currentBar', 'resources/currentBar.png');
    game.load.image('measureBar', 'resources/measureBar.png');

    game.load.audio('woodclick', 'resources/woodclick.ogg');

    if (instrument = "guitar") {
        for (var s = 1; s <= 6; ++s) {
            for (var f = 0; f <= 5; ++f) {
                var name = stringAndFretToPitch(s, f, -1);
                game.load.audio(name, 'samples/xt/' + name.replace("#", "%23") + '.wav');
            }
        }
    }
}

function addGuitarString(number) {

    var guitarString = game.add.tileSprite(
      0,
      guitarStringToY[number],
      totalWidth,
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

}

function create() {

    click = game.add.audio('woodclick');

    game.add.tileSprite(
        0,
        0,
        totalWidth,
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
                    (1 + time) * beatWidthAndPadding,
                    guitarStringToY[1] + 1,
                    'measureBar');
        }

        time += 1;
    }

    sounds["guitar"] = {};
    for (var s = 1; s <= 6; ++s) {
        for (var f = 0; f <= 5; ++f) {
            var name = stringAndFretToPitch(s, f, -1);
            sounds["guitar"][name] = game.add.audio(name);
        }
    }

    if (instrument = "guitar") {
        for (var bix in song.parts.guitar) {

            var item = song.parts.guitar[bix];
            playItems[item.startTime] = item;
            for (var nix in item.notes) {

                var note = item.notes[nix];

                if (!isNaN(note[0])) {
                    var noteSprite =
                            game.add.sprite(
                                (1 + startBeats + item.startTime) * beatWidthAndPadding,
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
    currentBeat = -startBeats;
    //game.time.events.loop(
        //(60000 / song.tempo) /* duration of beat in ms */ / (2 * updatesPerBeat));
    setInterval(
        function() {
            var mod = cycle % updatesPerBeat;
            if (mod == 0 ||
                mod == updatesPerBeat / 4 ||
                mod == updatesPerBeat / 2 ||
                mod == 3*updatesPerBeat / 4) {
                currentBeat += 0.25;
                setTimeout(onBeat, 250);
            }
            game.camera.x += beatWidthAndPadding / updatesPerBeat;
            if (currentBar)
                currentBar.x = game.camera.x + beatWidthAndPadding;
            cycle += 1;
        },
        (60000 / song.tempo) /* duration of beat in ms */ / updatesPerBeat);
        
        //true);
}

function onBeat()
{
    console.log("currentBeat: " + currentBeat);
    if (currentBeat % 1 == 0) {
        click.play();
    }
    // console.log("currentBeat: " + currentBeat);
    var playItem = playItems[currentBeat];
    if (playItem) {
        for (var jj = 0; jj < playItem.notes.length; ++jj) {
            var note = playItem.notes[jj];
            var name = stringAndFretToPitch(note[0], note[1], -1);
            console.log(name);
            sounds["guitar"][name].play();
        }
    }

}

function update() {


}

function render() {

}