package band.service;

import band.domain.BandMember;
import band.domain.Room;
import band.state.ApplicationState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class MultiplayerBandService {
    @Autowired
    private ApplicationState state;

    public String createRoom(String songId)
    {
        Room room = new Room();
        room.id = state.getRandomId();
        room.songId = songId;

        BandMember newMember = new BandMember();
        newMember.id = room.id;

        room.members.add(newMember);

        state.rooms.put(room.id, room);

        return room.id;
    }

    public Room joinRoom(String roomId)
    {
        Room room  = state.rooms.get(roomId);
        String id = null;

        BandMember newMember = new BandMember();
        boolean found = true;

        while (found)
        {
            id = state.getRandomId();
            found = false;

            Iterator<BandMember> iterator = room.members.iterator();

            while (iterator.hasNext())
            {
                String currentId = iterator.next().id;

                if (currentId.equals(id))
                {
                    found = true;
                    break;
                }
            }
        }

        newMember.id = id;
        room.members.add(newMember);

        return room;
    }

    public Room addInstrumentToRoom(String roomId, String userId, String instrument)
    {
        Room room = state.rooms.get(roomId);

        Iterator<BandMember> iterator = room.members.iterator();

        while (iterator.hasNext())
        {
            BandMember member = iterator.next();

            if (member.id.equals(userId))
            {
                member.instrument = instrument;
            }
        }

        return room;
    }
}
