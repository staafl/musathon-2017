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
// DEBUG var startBeats = 0; // 1 * song.beatsPerMeasure;
var startBeats = 1 * song.beatsPerMeasure;
var totalBeatsIncludingStart = (startBeats + song.duration) * song.tempo / 60;
var beatWidthAndPadding = 256;
var totalWidth = (1 + totalBeatsIncludingStart) * beatWidthAndPadding + 2*screen.width;
var updatesPerBeat = 128;
var beatDivisions = 16;
var click;
var currentBeat;
var currentBar;
var currentTime;
var notes;
var playItems = {};
var sounds = {};
var octaveShiftSamples = -1;
var octaveShiftInput = 0;
var currentPosition = 0;
var allPitches = [];
var bufferDelay = 10;
var keyboard =
    [
        [Phaser.Keyboard.ONE,Phaser.Keyboard.Q,Phaser.Keyboard.A,Phaser.Keyboard.Z],
        [Phaser.Keyboard.TWO,Phaser.Keyboard.W,Phaser.Keyboard.S,Phaser.Keyboard.X],
        [Phaser.Keyboard.THREE,Phaser.Keyboard.E,Phaser.Keyboard.D,Phaser.Keyboard.C],
        [Phaser.Keyboard.FOUR,Phaser.Keyboard.R,Phaser.Keyboard.F,Phaser.Keyboard.V],
        [Phaser.Keyboard.FIVE,Phaser.Keyboard.T,Phaser.Keyboard.G,Phaser.Keyboard.B],
        [Phaser.Keyboard.SIX,Phaser.Keyboard.Y,Phaser.Keyboard.H,Phaser.Keyboard.N],
    ];
var keyboard2 =
    [
        ["1","Q","A","Z"],
        ["2","W","S","X"],
        ["3","E","D","C"],
        ["4","R","F","V"],
        ["5","T","G","B"],
        ["6","Y","H","N"],
    ];
var keyBuffer = [];
var noteBuffer = [];

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

var channelName = "/room/" + QueryString["room"];

subscribe(channelName, function(event) {
	message = JSON.parse(event.getData());
	
	if (message.type === "play")
	{
		sounds[message.instrument][message.name].play();
	}
});

var guitarStringToY =
{
    1: 170,
    2: 250,
    3: 330,
    4: 410,
    5: 490,
    6: 570
};

function pitchToStringAndFret(p, Shift)
{
    var pos = 0;
//    for (var ii = 1; ii <= 6; ++ii) {
//        for (var f = 0; f <= 4; ++f) {
//            if (stringAndFretToPitch(ii, f + pos) == p) {
//                return [ii, f];
//            }
//        }
//    }
    for (var pos = 0; pos <= 24; pos += 3)
        for (var ii = 1; ii <= 6; ++ii) {
        for (var f = 0; f <= 3; ++f) {
            if (stringAndFretToPitch(ii, f + pos, Shift) == p) {
                // console.log("Resolving " + p + " as " + JSON.stringify([ii, f]));
                return [ii, f + pos];
            }
        }
    }
    console.log(p);
    throw new Exception();
    return null;
}

function stringAndFretToPitch(s, f, a)
{
    var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    var strings = ['E','B','G','D','A','E'];
    var stringOctave = [4, 3, 3, 3, 2, 2];
    var indexOf = notes.indexOf(strings[s - 1]);
    var toReturn = notes[(indexOf + f) % notes.length];
    toReturn += (stringOctave[s-1] + Math.floor((f + indexOf) / 12) + (a == undefined ? octaveShiftInput : a));
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
        notesToAdd = {};
        for (var s = 1; s <= 6; ++s) {
            for (var f = 0; f <= 10; ++f) {
                console.log(stringAndFretToPitch(s, f, octaveShiftInput));
                notesToAdd[stringAndFretToPitch(s, f, 0)] = true;;
                notesToAdd[stringAndFretToPitch(s, f, octaveShiftInput)] = true;;
                notesToAdd[stringAndFretToPitch(s, f, octaveShiftInput - 1)] = true;;
            }
        }
        for (var f = 6; f <= 20; ++f) {
            notesToAdd[stringAndFretToPitch(1, f, 0)] = true;;
            notesToAdd[stringAndFretToPitch(1, f, octaveShiftInput)] = true;;
            notesToAdd[stringAndFretToPitch(1, f, octaveShiftInput - 1)] = true;;
        }
        notesToAdd = Object.keys(notesToAdd);
        for (var n in Object.keys(notesToAdd)) {
            var name = notesToAdd[n];
            console.log("Loading " + name);
            allPitches.push(name);
            game.load.audio(name, 'samples/xt/' + name.replace("#", "%23") + '.wav');
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

function handleKey(s, f) {
    // console.log(name);
    // console.log("Key: " + JSON.stringify([s, currentPosition + f, currentTime]));
    keyBuffer.push([s, currentPosition + f, currentTime]);
    var name = stringAndFretToPitch(s, currentPosition + f, octaveShiftSamples);
    sounds["guitar"][name].play();
	publishMessage(channelName, {type: "play", instrument: instrument, name: name});
    matchBuffers();
}

function create() {

    click = game.add.audio('woodclick');

    game.add.tileSprite(
        0,
        0,
        totalWidth,
        screen.height,
        'sky');

    for (var sIx in keyboard) {
        for (var fIx in keyboard[sIx]) {
            (function() {
                var sIx1 = 1 + parseInt(sIx);
                var fIx1 = parseInt(fIx);
                game.input.keyboard.addKey(keyboard[sIx][fIx]).onDown.add(function() {
                    handleKey(sIx1, fIx1);
                }, this);
            })();
        }
    }

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
    for (var ix in allPitches) {
        sounds["guitar"][allPitches[ix]] = game.add.audio(allPitches[ix]);
    }

    if (instrument = "guitar") {
        for (var bix in song.parts.guitar) {
            var item = song.parts.guitar[bix];
            playItems[item.time] = playItems[item.time] || [];
            playItems[item.time].push(item);
            var name = item.name;
            // console.log(name);
            item.note = pitchToStringAndFret(name, 0);
        }

        for (var bix in song.parts.guitar) {
            var item = song.parts.guitar[bix];
            if (!item.note) {
                console.log(item.name);
            }
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
            while (true);
        }
    }
    position = minFret;
    for (var ii = 0; ii < piBuffer.length; ++ii) {
        piBuffer[ii].position = position;
    }

    for (var bix in song.parts.guitar) {
        var item = song.parts.guitar[bix];
        item.expectedKey = keyboard2[item.note[0] - 1][item.note[1] - item.position];
    }

    currentBar =
        game.add.sprite(
            0,
            0,
            'currentBar');

    currentBar.scale.setTo(2, 2);
    currentBeat = -startBeats - 1; 
    // DEBUG
    // currentBeat = 0; // TODO: -startBeats-1;
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

                  currentTime = cycle / (updatesPerBeat / beatDivisions) - beatDivisions*startBeats;
//console.log("current time: " + currentTime);

                  var playItemsNow = playItems[currentTime];
                  if (playItemsNow) {
                      // console.log(playItemsNow);
                      for (var ii = 0; ii < playItemsNow.length; ++ii) {
                        var playItem = playItemsNow[ii];
                        // console.log("Expected key: " + playItem.expectedKey);
                        if (playItem.isBacking)
                        {
                            (function() {
                                var ss = playItem.note[0];
                                var ff = playItem.note[1];
                                setTimeout(function() {
                                    var name = stringAndFretToPitch(ss, ff, octaveShiftSamples);
                                    //console.log("Playing backing " + name);
                                    sounds["guitar"][name].play();
                                }, 0);
                            })();
                        }
                        if (!playItem.isBacking) {
                            currentPosition = playItem.position;
                            // console.log("Reached " + JSON.stringify(playItem));
                            noteBuffer.push([playItem.note[0], playItem.note[1], currentTime]);
                        }
                      }
                  }
                  matchBuffers();
            }
            game.camera.x += beatWidthAndPadding / updatesPerBeat;
            if (currentBar)
                currentBar.x = game.camera.x + beatWidthAndPadding;
            cycle += 1;
        },
        (60000 / song.tempo) /* duration of beat in ms */ / updatesPerBeat);

        //true);
}
function matchBuffers() {
    for (var ii = keyBuffer.length - 1; ii >= 0; ii--) {
        if (currentTime - keyBuffer[ii][2] > bufferDelay) {
            // console.log("Extra key: " + JSON.stringify(keyBuffer[ii]));
            keyBuffer.splice(ii, 1);
        }
    }

    for (var ii = noteBuffer.length - 1; ii >= 0; ii--) {
        if (currentTime - noteBuffer[ii][2] > bufferDelay) {
            // console.log("Missed note: " + JSON.stringify(noteBuffer[ii]));
            noteBuffer.splice(ii, 1);
        }
    }

    for (var ii = noteBuffer.length - 1; ii >= 0; ii--) {
    for (var jj = keyBuffer.length - 1; jj >= 0; jj--) {
        if (keyBuffer[jj][0] == noteBuffer[ii][0] &&
            keyBuffer[jj][1] == noteBuffer[ii][1]) {
            console.log("Matched " + JSON.stringify(keyBuffer[jj]));
            // matchedTimes.push(noteBuffer[ii][2]);
            keyBuffer.splice(jj, 1);
            noteBuffer.splice(ii, 1);
            break;
        }
    }
    }
}

////                                currentPosition = playItem.currentPosition;
////                                var playItem = playItemsNow[ii];
////                                var note = playItem.note;
////                                var name = stringAndFretToPitch(note[0], note[1], -1);
////                                var isHit = false;
////                                notesBuffer.push(playItem);
//    for (var keyIx in keyBuffer) {
//        var key = keyBuffer[keyIx];
//        if (key.column == note[0] &&
//            key.row = note[1] - playItem.position) {
//            console.log("Hit: " + name);
//            isHit = true;
//            break;
//        }

//        if (!isHit) {
//            sounds["guitar"][name].play();
//        }
//    }
//}
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