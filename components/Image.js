const Joi = require('joi')

class Image extends require('./Basic') {
    constructor(url) {
        const
            constructure = {
                attachment: {
                    type: 'image',
                    payload: {
                        url: url
                    }
                }
            },
            schema = Joi.object().keys({
                attachment: {
                    type: 'image',
                    payload: {
                        url: Joi.string().uri().optional()
                    }
                }
            })
        super(constructure, schema)
    }
}

module.exports = Image
