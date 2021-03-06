const
    Joi = require('joi'),
    Button_Url = require('./Url'),
    Button_Postback = require('./Postback')

class Button_Nested extends require('./../Basic') {
    constructor(title, callToActions, option = {}) {
        const
            constructure = {
                type:'nested',
                title: title,
                call_to_actions: callToActions
            },
            schema = Joi.object().keys({
                type:'nested',
                title: Joi.string().max(30).required(),
                call_to_actions: Joi.array().min(1).max(5).items(Joi.alternatives().try([
                        Joi.object().type(Button_Url),
                        Joi.object().type(Button_Postback),
                        Joi.object().type(Button_Nested),
                    ]))
                    .when('composer_input_disabled', {
                        is: true,
                        then: Joi.required()
                    })
            })
        super(constructure, schema)
    }
}

module.exports = Button_Nested
