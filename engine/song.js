var song = {
  name: "Under The Bridge",
  duration: 322, // seconds
  backingTrack: "songs/under-the-bridge.mp3",
  previewTrack: "preview/under-the-bridge-preview.mp3",
  tempo: 34, // 69,
  beatsPerMeasure: 4,
  parts:
  {
    guitar: [
      {
        startTime: 0,
        position: 3, // fret pos
        notes: [  // notes
          [2, 3], // string, fret
          [5, 5],
          ["slide", [4, 4], [4, 6]],
          ["slide", [5, 5], [5, 7]],
          ["hammer", [5, 5], [5, 7]],
        ],
        backingNotes: [
        ],
        beats: 1  // duration (in beats)
      }
    ],
    drums: [

    ]
  }
};