import Discord from "discord.js";
import MessageHandler from "discord-message-handler";
import CommandHandler from "./command/CommandHandler";
import config from "../config.json";

if(!config || !config.token){
	console.error("You must define a \"config.json\" file based on \"config.default.json\"");
	process.exit();
}

const client = new Discord.Client();
const commandHandler = new CommandHandler();


client.on('ready', () => {
	console.log('Bot ready!');
});

MessageHandler.whenMessageContainsWord("shrug").reply("¯\\_(ツ)_/¯");

client.on("message", (request) => {
	/*if(request.content === "!ping"){
		console.log("!ping");
		request.channel.send("pong!");
	}*/
	//MessageHandler.handleMessage(request);
	commandHandler.handleRequest(request);
});

client.login(config.token);
