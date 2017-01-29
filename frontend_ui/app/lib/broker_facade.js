import './nirvana'
const BASE_URL = process.env.API_URL + ':11000'

var session = Nirvana.createSession({
	realms : [BASE_URL],
	applicationName : "MultiplayerBand"
});

session.start();

export function subscribe(channelName, callback)
{
	var channel = session.getChannel(channelName);
	
	channel.on(Nirvana.Observe.DATA, callback);
	channel.subscribe();
}

export function publishMessage(channelName, message)
{
	var channel = session.getChannel(channelName);

	var event = Nirvana.createEvent();
	event.setData(JSON.stringify(message));
	
	channel.publish(event);
}