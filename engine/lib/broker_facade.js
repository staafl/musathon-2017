var session = Nirvana.createSession({
	realms : ["http://192.168.111.22:11000/"],
	applicationName : "MultiplayerBand"
});

session.start();

function subscribe(channelName, callback)
{
	var channel = session.getChannel(channelName);
	
	channel.on(Nirvana.Observe.DATA, callback);
	channel.subscribe();
}

function publishMessage(channelName, message)
{
	var channel = session.getChannel(channelName);

	var event = Nirvana.createEvent();
	event.setData(JSON.stringify(message));
	
	channel.publish(event);
}