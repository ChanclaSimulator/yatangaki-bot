import SongRequestCommand from './SongRequestCommand';

class CommandManager {
    constructor() {
        this.commands = [];
        this.commandQueue = [];

        this.register(new SongRequestCommand());
    }

    register(command) {
        this.commands.push(command);
    }

    handleRequest(request) {
        console.log("handle request", request.content);
        let that = this;
        this.commands.forEach(command => {
            console.log("lol");
            if(command.match(request.content)){
                that.commandQueue.push(function(){
                    return new Promise((resolve, reject) => {
                        try {
                            setTimeout(function(){
                                command.action(request);
                                resolve();
                            }, 1000);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                console.log("before");
                that.processQueue();
                console.log("after");
            }
        });
    }

    processQueue(){
        console.log("processQueue");
        if(this.commandQueue[0]){
            // pop first item
            this.commandQueue.shift()().then(function(){
                console.log("commande terminée");
            });
        }
    }
}

export default CommandManager;
