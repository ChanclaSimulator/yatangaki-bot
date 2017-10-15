import path from "path";
import Discord from "discord.js";
import CommandHandler from "./CommandHandler";
import {imgAssetsPath} from "./utils";
import config from "../config.json";

if(!config || !config.token){
	console.error("You must define a \"config.json\" file based on \"config.default.json\"");
	process.exit();
}

const client = new Discord.Client();
const commandHandler = new CommandHandler();


client.on('ready', () => {
	console.log('Bot ready!');
	console.log("set avatar:", path.join(imgAssetsPath, "risitas.png"));
	client.user.setAvatar(path.join(imgAssetsPath, "risitas.png"))
		.then(() => console.log("New avatar set!"))
		.catch(console.error);

	client.user.setGame("Risitas Simulator 2017")
		.then(() => console.log("New game set!"))
		.catch(console.error);

	client.user.setUsername("Yatangaki Bot")
		.then(() => console.log("New username set!"))
		.catch(console.error);
});

client.on("message", (request) => {
	commandHandler.handleRequest(request);
});

client.login(config.token);
