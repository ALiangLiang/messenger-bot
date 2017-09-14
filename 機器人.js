const
    EventEmitter = require('events'),
    通訊介面 = require('./通訊介面'),
    零件 = require('./零件');

module.exports = class 機器人 extends EventEmitter {

    constructor(設定) {
        this.設定 = 設定;
        this.通訊介面 = new 通訊介面(設定.key, 設定.cert, 設定.ca);
    }

    收到(種類, 回呼函數) {
        (req, res) => {
            if (req)
                this.emit('')
        }
        this.通訊介面.on('message', () => {

        })
        回呼函數(零件);
    }

    說() {

    }

    get 零件() {
        return 零件
    }

};
