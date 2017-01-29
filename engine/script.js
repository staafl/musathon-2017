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
var beatWidth = 100;
var startBeats = 1 * song.beatsPerMeasure;
var totalBeatsIncludingStart = (startBeats + song.duration) * song.tempo / 60;
var beatWidthAndPadding = 128;
var totalWidth = (1 + totalBeatsIncludingStart) * beatWidthAndPadding + 2*screen.width;
var updatesPerBeat = 128;
var beatDivisions = 16;
var click;
var currentBeat;
var currentBar;
var notes;
var playItems = {};
var sounds = {};
var defaultOctaveShift = 0;

var guitarStringToY =
{
    1: 170,
    2: 250,
    3: 330,
    4: 410,
    5: 490,
    6: 570
};

function pitchToStringAndFret(p)
{
    for (var pos = 0; pos <= 16; pos += 4)
    for (var ii = 1; ii <= 6; ++ii) {
        for (var f = 0; f <= 4; ++f) {
            if (stringAndFretToPitch(ii, f + pos) == p) {
                return [ii, f];
            }
        }
    }
    return null;
}

function stringAndFretToPitch(s, f, a)
{
    var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    var strings = ['E','B','G','D','A','E'];
    var stringOctave = [4, 3, 3, 3, 2, 2];
    var indexOf = notes.indexOf(strings[s - 1]);
    var toReturn = notes[(indexOf + f) % notes.length];
    toReturn += (stringOctave[s-1] + Math.floor((f + indexOf) / 12) + (a || defaultOctaveShift));
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

    // todo: slip loading samples we won't need
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
            guitarString.scale.setTo(1, 0.40);
            break;
        case 2:
            guitarString.scale.setTo(1, 0.50);
            break;
        case 3:
            guitarString.scale.setTo(1, 0.60);
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

    while (time < totalBeatsIncludingStart + song.beatsPerMeasure) {

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
            playItems[item.time] = playItems[item.time] || [];
            playItems[item.time].push(item);
            var name = item.name;
            // console.log(name);
            item.note = pitchToStringAndFret(name);
        }

        for (var bix in song.parts.guitar) {
            var item = song.parts.guitar[bix];
            if (!isNaN(item.note[0]) &&
                !item.isBacking) {
                var noteSprite =
                    game.add.sprite(
                        (1 + startBeats + item.time / beatDivisions) * beatWidthAndPadding,
                        guitarStringToY[item.note[0]] - 9,
                        'qNote');
                noteSprite.scale.setTo((beatWidth / beatIconWidth) * item.beats, 1);
            }
        }

        var position = 0;
        var minFret = 100;
        var maxFret = -1;
        var piBuffer = [];
        for (var pix in playItems) {
            var change = false;
            do
            {
                var minNow = 100;
                var maxNow = -1;
                var index = 0;
                for (var pixi in playItems[pix] || []) {
                    var playItem = playItems[pix][pixi];
                    if (playItem.isBacking) {
                        continue;
                    }

                    if (Math.max(playItem.note[1], maxFret) - Math.min(playItem.note[1], minFret) > 3) {
                        if (Math.max(playItem.note[1], maxNow) - Math.min(playItem.note[1], minNow) > 3) {
                            console.log("too big of a stretch here: " + pix);
                            playItem.isBacking = true;
                            continue;
                        }
                        else {
                            change = true;
                            break;
                        }
                    }
                    if (index >= 2) {
                        console.log("too many notes: " + pix);
                        playItem.isBacking = true;
                        continue;
                    }
                    
                    index += 1;

                    if (playItem.note[1] > maxFret) {
                        maxFret = playItem.note[1];
                    }
                    if (playItem.note[1] < minFret) {
                        minFret = playItem.note[1];
                    }
                    if (playItem.note[1] > maxNow) {
                        maxNow = playItem.note[1];
                    }
                    if (playItem.note[1] < minNow) {
                        minNow = playItem.note[1];
                    }

                    position = minFret;
                }
                if (change) {
                    minFret = 100;
                    maxFret = -1;
                    for (var ii = 0; ii < piBuffer.length; ++ii) {
                        piBuffer[ii].position = position;
                    }
                    piBuffer = [];
                    change = false;
                    continue;
                }
                else {
                    piBuffer = piBuffer.concat(playItems[pix]);
                    change = false;
                    break;
                }
            }
            while (false);
        }
    }
    position = minFret;
    for (var ii = 0; ii < piBuffer.length; ++ii) {
        piBuffer[ii].position = position;
    }

    currentBar =
        game.add.sprite(
            0,
            0,
            'currentBar');

    currentBar.scale.setTo(2, 2);
    currentBeat = -startBeats-1;
    //game.time.events.loop(
        //(60000 / song.tempo) /* duration of beat in ms */ / (2 * updatesPerBeat));
    setInterval(
        function() {
            var mod = cycle % updatesPerBeat;
            if (mod % updatesPerBeat == 0) {
                currentBeat += 1;
                // console.log("currentBeat: " + currentBeat);
                setTimeout(onBeat, 0);
            }
            if (mod % (updatesPerBeat / beatDivisions) == 0) {

                var time = cycle / (updatesPerBeat / beatDivisions) - beatDivisions*startBeats;
                // console.log("current time: " + time);
                (function() {
                    var playItemsNow = playItems[time];
                    if (playItemsNow) {
                        setTimeout(function() {
                            for (var ii = 0; ii < playItemsNow.length; ++ii) {
                                var playItem = playItemsNow[ii];
                                var note = playItem.note;
                                var name = stringAndFretToPitch(note[0], note[1], -1);
                                // console.log(name);
                                sounds["guitar"][name].play();
                            }
                        }, 0);
                    }
                })();
            }
            game.camera.x += beatWidthAndPadding / updatesPerBeat;
            if (currentBar)
                currentBar.x = game.camera.x + beatWidthAndPadding;
            cycle += 1;
        },
        (60000 / song.tempo) /* duration of beat in ms */ / updatesPerBeat);

        //true);
}
var cycle = 0;

function onBeat()
{
    if (currentBeat % 1 == 0) {
        click.play();
    }
}

function update() {


}

function render() {

}