package band.service;

import band.domain.Room;
import band.state.ApplicationState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MultiplayerBandService {
    @Autowired
    private ApplicationState state;

    public String createRoom(String songId)
    {
        Room room = new Room();
        room.id = state.getRandomId();
        room.songId = songId;

        state.rooms.put(room.id, room);

        return room.id;
    }
}
