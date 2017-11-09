import AbstractCommand from './AbstractCommand'

class PlayCommand extends AbstractCommand {

    constructor(){
        super();
		this.compileRegexs([
			"^!play (?<name>[^ /]+)(?: x(?<repeat>[1-9]))?$"
		]);
    }

    action(request, regexResult) {
        //request.channel.send(JSON.stringify(regexResult));
		console.log("name: ", regexResult.name);
		console.log("repeat: ", regexResult.repeat);
		// player.play({name: regexResult.name, repeat: regexResult.repeat})
    }

}

export default PlayCommand;
