import cmdList from "./list.json";
import Ajv from "ajv"; // Ajv: Another JSON Schema Validator

const cmdListSchema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "command": {
                "type": "string"
            },
            "alias": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": ["command"]
    }
};

class CommandHandler {
	constructor() {
		let ajv = new Ajv();
		let isJsonValid = ajv.validate(cmdListSchema, cmdList);
		if(!isJsonValid){
			throw new Error(`Invalid json schema. ${ajv.errorsText()}. Please check "src/command/list.json"`);
		}
		this.cmdList = cmdList;
		this.cmdList.push({
			"command": "!help"
		});
	}

	handleRequest = (request) => {
		let {content} = request;

		if(!request.content.startsWith("!")){
			return;
		}
		if(["!h", "!help", "!cmdlist"].includes(content)){
			request.channel.send("yolo");
			return;
		}

		let test = this.cmdList.find((e) => e.command === content);
		if(test) {
			if(test.playAudio){
				let voiceChannel = request.member.voiceChannel;

				voiceChannel.join().then(connection => {
					return connection.playFile('/home/benoit/Documents/GitHub/yatangaki-bot/assets/audio/air.wav'); // non opti
				}).then(dispatcher => {
					dispatcher.on('error', console.error);
					dispatcher.on("end", end => {
	  					voiceChannel.leave();
	  				});
				}).catch(console.error);

			}
			request.channel.send(test.playAudio);
		}
	}
}

export default CommandHandler;
