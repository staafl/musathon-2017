package band.controller;

import band.domain.Room;
import band.service.MultiplayerBandService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pcbsys.nirvana.client.nChannelAttributes;
import com.pcbsys.nirvana.client.nSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
public class MultiplayerBandController {
    @Autowired
    private MultiplayerBandService service;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private nSession nsession;

    @CrossOrigin
    @RequestMapping(value = "/rooms/{songId}", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    public Room createRoom(@PathVariable(name = "songId") String songId) throws Exception
    {
        Room room = service.createRoom(songId);

        nChannelAttributes channelAttributes = new nChannelAttributes("/room/" + room.id);
        nsession.createChannel(channelAttributes);

        return room;
    }

    @CrossOrigin
    @RequestMapping(value = "/rooms/{roomId}/join", produces = "application/json; charset=utf-8")
    public Room joinRoom(@PathVariable(name = "roomId") String roomId)
    {
        return service.joinRoom(roomId);
    }

    @CrossOrigin
    @RequestMapping(value = "/rooms/{roomId}/instrument/{userId}/{instrument}", produces = "application/json; charset=utf-8")
    public Room joinRoom(
            @PathVariable(name = "roomId") String roomId,
            @PathVariable(name = "userId") String userId,
            @PathVariable(name = "instrument") String instrument)
    {
        return service.addInstrumentToRoom(roomId, userId, instrument);
    }

    @ModelAttribute
    public void setCorsResponseHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
}
