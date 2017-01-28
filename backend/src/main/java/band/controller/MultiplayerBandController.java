package band.controller;

import band.service.MultiplayerBandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MultiplayerBandController {
    @Autowired
    private MultiplayerBandService service;

    @RequestMapping(value = "/rooms/{songId}", method = RequestMethod.POST)
    public String createRoom(@PathVariable(name = "songId") String songId)
    {
        return service.createRoom(songId);
    }
}
