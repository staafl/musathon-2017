package band.service;

import band.domain.BandMember;
import band.domain.Room;
import band.domain.UserJoinedToRoom;
import band.state.ApplicationState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class MultiplayerBandService {
    @Autowired
    private ApplicationState state;

    private final int MAGIC_NUMBER = 2;

    public Room createRoom(String songId)
    {
        Room room = new Room();
        room.id = state.getRandomId();
        room.songId = songId;

        BandMember newMember = new BandMember();
        newMember.id = room.id;

        room.members.add(newMember);

        state.rooms.put(room.id, room);

        return room;
    }

    public UserJoinedToRoom joinRoom(String roomId)
    {
        Room room  = state.rooms.get(roomId);
        UserJoinedToRoom result = new UserJoinedToRoom();

        if (room.members.size() >= MAGIC_NUMBER)
        {
            result.failed = true;
            return result;
        }

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

        result.userId = id;
        result.room = room;

        return result;
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

    public boolean memberReady(String roomId, String userId) {
        boolean result = true;
        Room room = state.rooms.get(roomId);

        Iterator<BandMember> iterator = room.members.iterator();

        while (iterator.hasNext())
        {
            BandMember member = iterator.next();

            if (member.id.equals(userId))
            {
                member.ready = true;
            }

            if (member.ready == false)
            {
                result = false;
            }
        }

        return result;
    }
}
