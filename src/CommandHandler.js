import path from "path";
import cmdList from "../assets/cmd.json";
import {audioAssetsPath, imgAssetsPath} from "./utils";
import _ from "lodash";
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
            },
			"reply": {
				"type": "string"
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

		// generate help display
		let helpText = "Available commands:\n------------------------------\n";
		let helpBuilder = [];
		let joinedAliasCmdList = cmdList.map(({alias, command, ...rest}) => {
			if(alias){
				alias = alias.map((a) => `!${a}`);
			}
			return({alias: alias ? `[${alias.join(", ")}]` : "-", command: `!${command}`, ...rest});
		});
		joinedAliasCmdList.unshift(
			{command: "Command", alias: "Alias", description: "Description"},
			{command: "------", alias: "------", description: "------"},
			{command: "!help", alias: "[!h, !cmdlist]", description: "View help"},
		);
		let longestCommandString = joinedAliasCmdList.reduce((a, b) => a > b.command.length ? a : b.command.length);
		let longestAliasString = joinedAliasCmdList.reduce((a, b) => a > b.alias.length ? a : b.alias.length);
		joinedAliasCmdList.forEach((cmd) => {
			helpBuilder.push(`${_.padEnd(cmd.command, longestCommandString)} ${_.padEnd(cmd.alias, longestAliasString)} ${cmd.description ? cmd.description : "-"}`);
		});
		helpText += helpBuilder.join("\n");
		this.cmdList.push({
			"command": "help",
			"alias": ["h", "cmdlist"],
			"reply": helpText
		});

		this.queueMod = false; // TODO
		this.alwaysInChannel = false; // TODO
		this.playing = false;
	}

	startPlayer = (fileName, request) => {
		if(!this.playing){
			let voiceChannel = request.member.voiceChannel;
      if(voiceChannel){
  			this.voiceChannel = voiceChannel;

  			voiceChannel.join().then(connection => {
  				let audioFilePath = path.join(audioAssetsPath, fileName);
  				console.log("Playing:", audioFilePath);
  				this.playing = true;
  				return connection.playFile(audioFilePath); // non opti
  			}).then(dispatcher => {
  				dispatcher.on("error", err => {
  					console.error(err);
  					this.playing = false;
  					voiceChannel.leave();
  				});
  				dispatcher.on("end", end => {
  					this.playing = false;
  					voiceChannel.leave();
  				});
  			}).catch(console.error);
      }else{
            request.channel.send("your are not in a voice channel", {code: true});
      }
		}else{
			request.channel.send("an audio file is already playing", {code: true});
		}
	}

	stopPlayer = () => {
		if(this.playing){
			this.voiceChannel.leave();
			this.playing = false;
		}
	}

	handleRequest = (request) => {
		let {content} = request;

		if(!request.content.startsWith("!")){
			return;
		}
		let test = this.cmdList.find((e) => {
			let command = content.substr(1); // delete the "!"
			return e.command === command || (e.alias && e.alias.includes(command))
		});
		if(test) {
			if(test.playAudioFile){
				this.startPlayer(
					test.playAudioFile instanceof Array ? _.sample(test.playAudioFile) : test.playAudioFile,
					request
				);
			}
			if(test.functionName){
				this[test.functionName]();
			}
			if(test.reply || test.attachment){
				request.channel.send(
					test.reply,
					{
						code: test.reply && test.reply.includes("\n"),
						file: test.attachment ? path.join(imgAssetsPath, test.attachment instanceof Array ? _.sample(test.attachment) : test.attachment) : undefined
					}
				);
			}
		}
	}
}

export default CommandHandler;
