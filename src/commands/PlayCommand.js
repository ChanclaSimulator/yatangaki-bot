import AbstractCommand from './AbstractCommand';
import youtubeStream from "youtube-audio-stream";
import Kommandr from "kommandr";

class PlayCommand extends AbstractCommand {

    constructor(){
        super(/*new kommander*/);
		this.kommandr = new Kommandr("play", {prefix: "!", aliases: ["p"]})
			.argument("<videoId>")
			.option("-r --repeat []", "Reapeat sound n times");
		this.kommandr.on("all", (msg) => {
			if(this.toSendChannel){
				this.toSendChannel.send(`${this.memberName}\n${msg}`, {code: true, reply: this.toSendMember});
			}
		});
    }

	handleRequest(request){
		if (!request.content.startsWith('!')) {
            return;
        }


		console.log(request.content);
		this.toSendChannel = request.channel;
		this.memberName = request.member.displayName;
		this.toSendMember = request.member;
		this.kommandr.parse(request.content);
		this.toSendChannel = null;
		this.memberName = null;
		this.toSendMember = null;

		console.log(this.kommandr.result);
		if(!this.kommandr.result){
			return;
		}
		if(request.member.voiceChannel){
			try {
				let stream = youtubeStream('http://youtube.com/watch?v=' + this.kommandr.result.videoId);
				setTimeout(() => {
					stream.pause();
				}, 3000)
				request.member.voiceChannel.join().then(connection => {
					return connection.playStream(stream); // non opti
				}).then(dispatcher => {
					dispatcher.on("error", err => {
						console.error(err);
						voiceChannel.leave();
					});
					dispatcher.on("end", end => {
						voiceChannel.leave();
					});
				}).catch(console.error);
			} catch (e) {
				request.channel.send("Not found video");
			}
		}
	}

    action(request, regexResult) {
        //request.channel.send(JSON.stringify(regexResult));
		console.log("name: ", regexResult.name);
		console.log("repeat: ", regexResult.repeat);
		// player.play({name: regexResult.name, repeat: regexResult.repeat})
    }

}

export default PlayCommand;
