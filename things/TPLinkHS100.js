const TPLinkHS100x = require('hs100-api');
const TPLinkHS100xClient = new TPLinkHS100x.Client();

const emitEvent = (app, state, device) => {
    app.io.emit('update', {
        "state": state,
        "device": device
    });
};

class TPLinkHS100 {
    constructor(app){
        this.app = app;
    }    

    init(){
        TPLinkHS100xClient.on('plug-new', (plug) => {
            ['power-on', 'power-off']
                .forEach(event => plug.on(event, plug => {
                    let state = (event == 'power-on') ? true : false;
                    emitEvent(this.app, state, plug.model)
                }));
        });

        TPLinkHS100xClient.startDiscovery().on('plug-new', (plug) => {
            setInterval(() => {
                plug.getPowerState().then(state => emitEvent(this.app, state, plug.model));
            }, 1000);
        });
    }
}

module.exports = TPLinkHS100;