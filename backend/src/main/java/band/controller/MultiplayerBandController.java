package band.controller;

import band.domain.Room;
import band.domain.RoomReady;
import band.domain.RoomUpdated;
import band.domain.UserJoinedToRoom;
import band.service.MultiplayerBandService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pcbsys.nirvana.client.*;
import com.pcbsys.nirvana.nAdminAPI.nACLEntry;
import com.pcbsys.nirvana.nAdminAPI.nLeafNode;
import com.pcbsys.nirvana.nAdminAPI.nRealmNode;
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

    @Autowired
    private nRealmNode realmNode;

    @CrossOrigin
    @RequestMapping(value = "/rooms/{songId}", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    public Room createRoom(@PathVariable(name = "songId") String songId) throws Exception
    {
        Room room = service.createRoom(songId);

        nChannelAttributes channelAttributes = new nChannelAttributes("/room/" + room.id);
        nsession.createChannel(channelAttributes);

        nLeafNode leafNode = null;

        while (leafNode == null)
        {
            leafNode = (nLeafNode) realmNode.findNode("/room/" + room.id);
        }

        nACLEntry acl = leafNode.getACLs().find("Everyone");
        acl.setFullPrivileges(true);
        leafNode.addACLEntry(acl);

        return room;
    }

    @CrossOrigin
    @RequestMapping(value = "/rooms/{roomId}/join", produces = "application/json; charset=utf-8")
    public UserJoinedToRoom joinRoom(@PathVariable(name = "roomId") String roomId) throws Exception
    {
        UserJoinedToRoom result = service.joinRoom(roomId);

        if (!result.failed)
        {
            RoomUpdated roomUpdated = new RoomUpdated();
            roomUpdated.type = "joinedRoom";
            roomUpdated.room = result.room;
            String notification = mapper.writeValueAsString(roomUpdated);

            nChannel channel = nsession.findChannel(new nChannelAttributes("/room/" + result.room.id));

            nConsumeEvent event = nConsumeEventFactory.create("", notification.getBytes(), -1, false);
            channel.publish(event);
        }

        return result;
    }

    @CrossOrigin
    @RequestMapping(value = "/rooms/{roomId}/instrument/{userId}/{instrument}", produces = "application/json; charset=utf-8")
    public Room chooseInstrument(
            @PathVariable(name = "roomId") String roomId,
            @PathVariable(name = "userId") String userId,
            @PathVariable(name = "instrument") String instrument) throws Exception
    {
        Room result = service.addInstrumentToRoom(roomId, userId, instrument);

        RoomUpdated roomUpdated = new RoomUpdated();
        roomUpdated.type = "instrumentChosen";
        roomUpdated.room = result;
        String notification = mapper.writeValueAsString(roomUpdated);

        nChannel channel = nsession.findChannel(new nChannelAttributes("/room/" + result.id));

        nConsumeEvent event = nConsumeEventFactory.create("", notification.getBytes(), -1, false);
        channel.publish(event);

        return result;
    }

    @CrossOrigin
    @RequestMapping(value = "/rooms/{roomId}/ready/{userId}", produces = "application/json; charset=utf-8")
    public void chooseInstrument(
            @PathVariable(name = "roomId") String roomId,
            @PathVariable(name = "userId") String userId) throws Exception
    {
        boolean allMembersReady = service.memberReady(roomId, userId);

        if (allMembersReady)
        {
            RoomReady roomReady = new RoomReady();
            roomReady.roomId = roomId;

            String notification = mapper.writeValueAsString(roomReady);

            final nChannel channel = nsession.findChannel(new nChannelAttributes("/room/" + roomId));

            final nConsumeEvent event = nConsumeEventFactory.create("", notification.getBytes(), -1, false);

            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(10000);
                        channel.publish(event);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

            thread.start();
        }
    }

    @ModelAttribute
    public void setCorsResponseHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
}
