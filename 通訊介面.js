const EventEmitter = require('events');

module.exports = class 通訊介面 extends EventEmitter {

    constructor(key, cert, ca) {
        const
            https = require('https'),
            fs = require('fs'),
            伺服器 = https.createServer({
                    key: fs.readFileSync(key),
                    cert: fs.readFileSync(cert),
                    ca: fs.readFileSync(ca),
                },
                function(req, res) {
                    this.emit('messeage', req.body);
                });
        伺服器.listen(8000);
    }

    傳送() {

    }

};
