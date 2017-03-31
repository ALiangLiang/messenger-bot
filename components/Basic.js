const Joi = require('joi')

class Basic {
    constructor(constructure = {}, schema) {
        this._constructure = constructure
        if (schema && Basic._strictMode) {
            Joi.validate(constructure, schema, function(err, value) {
                if (err)
                    throw new Error(err)
                        // console.log(value)
            });
        }
    }

    static set strictMode(strictMode) {
        this._strictMode = strictMode
    }

    set constructure(constructure) {}

    get constructure() {
        return this._constructure
    }
}

module.exports = Basic
