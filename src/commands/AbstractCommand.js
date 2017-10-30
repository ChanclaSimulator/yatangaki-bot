class AbstractCommand {


    constructor() {
        if (new.target === AbstractCommand) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    match(message) {
        return this.matchRegexs.some(matchRegex => matchRegex.test(message));
    }

    action(request) {

    }
}


export default AbstractCommand;
