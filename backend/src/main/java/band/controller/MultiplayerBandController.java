package band.controller;

import band.domain.Room;
import band.service.MultiplayerBandService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MultiplayerBandController {
    @Autowired
    private MultiplayerBandService service;

    @Autowired
    private ObjectMapper mapper;

    @RequestMapping(value = "/rooms/{songId}", method = RequestMethod.POST)
    public String createRoom(@PathVariable(name = "songId") String songId)
    {
        return service.createRoom(songId);
    }

    @RequestMapping(value = "/rooms/{roomId}/join")
    public Room joinRoom(@PathVariable(name = "roomId") String roomId)
    {
        return service.joinRoom(roomId);
    }
}
