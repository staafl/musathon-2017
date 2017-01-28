package band.state;

import band.domain.Room;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ApplicationState {
    public static String[] PREDEFINED_IDS =
        {
            "BraveGoldfinch",
            "StupendousRattlesnake",
            "AvailableShrimp",
            "LameJackrabbit",
            "JoblessRat",
            "SingleGerbil",
            "ThankfulCheetah",
            "BeautifulWoodcock",
            "BrawnyLice",
            "CulturedJaguar",
            "GrubbyDolphin",
            "EminentEland",
            "FrayedMoth",
            "RoughKangaroo",
            "SqueamishQuail",
            "SoberChamois",
            "FarHare",
            "GamyButterfly",
            "AncientPrairiedog",
            "MatureCockroach",
            "TactfulDunbird",
            "OutspokenRacehorse",
            "FriendlyMallard",
            "OpulentWidgeon",
            "UnsungBlackbird"
        };

    public Map<String, Room> rooms = new ConcurrentHashMap<>();

    public String getRandomId()
    {
        int rnd = new Random().nextInt(PREDEFINED_IDS.length);
        return PREDEFINED_IDS[rnd];

    }
}
