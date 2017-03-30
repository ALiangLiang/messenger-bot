const Joi = require('joi')

class Basic {
    constructor(constructure = {}, schema) {
        this._constructure = constructure
        if (schema) {
            Joi.validate(constructure, schema, function(err, value) {
                if (err)
                    throw new Error(err)
                console.log(value)
            });
        }
    }

    set constructure(constructure) {}

    get constructure() {
        return this._constructure
    }
}

module.exports = Basic
