using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
class Program
{
    static int octaveShift = 0;

    static void PitchToStringAndFret(string p, out int s, out int f)
    {

        for (s = 1; s <= 6; ++s) {
            for (f = 0; f <= 24; ++f) {
                if (StringAndFretToPitch(s, f) == p) {
                    return;
                }
            }
        }
        throw new Exception("Can't locate pitch: " + p);
    }

    static string StringAndFretToPitch(int s, int f)
    {
        var notes = new[]{"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"};
        var strings = new[]{"E","B","G","D","A","E"};
        var stringOctave = new[]{4, 3, 3, 3, 2, 2};
        var indexOf = Array.IndexOf(notes, strings[s - 1]);
        var toReturn = notes[(indexOf + f) % notes.Length];
        toReturn += (stringOctave[s-1] + (int)((f + indexOf) / 12) + octaveShift);
        return toReturn;
    }

    static void Main(string[] args)
    {
        double tempo = args.Length > 0 ? double.Parse(args[0]) : 74;
        int beatDivisions = args.Length > 1 ? int.Parse(args[1]) : 16;
        double beatLengthMs = 60000 / tempo;
        double beatLengthS = 60 / tempo;
        double beatDivisionLengthS = beatLengthS / beatDivisions;
        double firstNoteStartS = 3.24324;
        while (true)
        {
            var line = Console.ReadLine();
            if (line == null)
            {
                break;
            }
            if (line.StartsWith("        {"))
            {
                Console.WriteLine("{");
                while (true)
                {
                    line = Console.ReadLine();
                    if (line == "        }," ||
                        line == "        }")
                    {
                        Console.WriteLine("    isBacking: false,");
                        break;
                    }
                    var match = Regex.Match(line, "\"([^\"]+)\": \"?([^\",]+)\"?,?");
                    if (string.IsNullOrWhiteSpace(line))
                    {
                        continue;
                    }
                    if (!match.Success)
                    {
                        throw new Exception(line);
                    }
                    var left = match.Groups[1].Value;
                    var right = match.Groups[2].Value;
                    if (left == "name")
                    {
                        int fret, s;
                        // PitchToStringAndFret(right, out s, out fret);
                        Console.WriteLine(line);
                        // Console.WriteLine($"    note: [{s}, {fret}], // " + line.Trim());
                        continue;
                    }
                    if (left == "time")
                    {
                        double time = double.Parse(right);
                        time -= firstNoteStartS;
                        time -= (time % beatDivisionLengthS);
                        time /= beatLengthS;
                        time *= beatDivisions;
                        Console.WriteLine($"    time: {time.ToString()}, // " + line.Trim());
                        continue;
                    }
                    if (left == "duration")
                    {
                        double duration = double.Parse(right);
                        duration -= (duration % beatDivisionLengthS);
                        duration /= beatLengthS;
                        // if (duration < 0.25)
                            duration = 0.25;
                        Console.WriteLine($"    beats: {duration.ToString()}, // " + line.Trim());
                        continue;
                    }
                }

                Console.WriteLine("},");
            }
        }
    }
}
