import AbstractCommand from './AbstractCommand'

class SongRequestCommand extends AbstractCommand {

    constructor(){
        super();
        this.matchRegexs = [
            /!test/g
        ];
    }

    action(request) {
        request.channel.send("hey!");
    }

}

export default SongRequestCommand;
