import XregExp from 'xregexp';

class AbstractCommand {

    constructor() {
        if (new.target === AbstractCommand) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

		//this.commandRegexs = []; // first = command, other = alias
    }

	handleRequest(request){
		for(let commandRegex of this.commandRegexs){
			//let regexResult = commandRegex.exec(request.content);
			let regexResult = XregExp.exec(request.content, commandRegex);
			console.log(commandRegex);
			console.log(request.content);
			console.log(regexResult);
			if(regexResult){
				this.action(request, regexResult)
				break;
			}
		}
	}

    action(request, regexResult) {

    }
}


export default AbstractCommand;
