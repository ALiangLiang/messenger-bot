/**
 * Module dependencies.
 * @private
 */
const
    bodyParser = require('body-parser'),
    router = require('router')(),
    send = require('./send')


/**
 * Initialize `Interface` with given option,
 *
 * @param {Object} option
 * @api public
 */
module.exports = function(option = {}) {
    Interface.API_VERSION = option.apiVersion | 'v2.8'
    Interface.PAGE_ACCESS_TOKEN = option.pageAccessToken
    return Interface
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Router} botRouter
 * @param {Function} handler
 * @api public
 */
function Interface(req, res, botRouter, handler) {

    // Automatic end the request
    router.use(function(req, res, next) {
        res.end('finish')
        next()
    })

    // Parse body to JSON format
    router.use(bodyParser.json())

    router.use(function(req, res, next) {
        try {
            Object.assign(req, normalize(req.body))

            // setup res.send
            res.send = function(body) {
                let structure = {
                    recipient: req.psid,
                    message: serializer(body)
                }
                send(structure)
            }
            next()
        } catch (e) {
            console.error(e)
            return next(e)
        }
    })

    router.use(botRouter)

    router(req, res, handler)
}

/**
 * Initialize `Route` with the given `path`,
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Router} botRouter
 * @param {Function} handler
 * @api public
 */
function normalize(body) {
    let
        psid = body.sender.id,
        method,
        payload = '/foo',
        text,
        coordinates,
        multimedia = {}

    // text
    if (body.text) {
        method = 'TEXT'
        text = body.text
    }
    // postback
    else if (body.postback && body.postback.payload) {
        method = 'POSTBACK'
        payload = body.postback.payload
    }
    // attachment
    else if (body.attachments && body.attachments.length !== 0) {
        const attachment = body.attachments[0]
        switch (attachment.type) {
            case 'audio':
            case 'fallback':
            case 'file':
            case 'image':
            case 'video':
                multimedia[attachment.type] = attachment.url
                break
            case 'location':
                coordinates = attachment.coordinates
                break
        }
        method = attachment.type.toUpperCase()
    }
    // unknown type
    else
        throw new Error('no matched method')
    return Object.assign({
        psid: body.sender.id,
        method: method,
        text: text,
        payload: payload,
        coordinates: coordinates
    }, multimedia)
}

function serializer(object) {
    try {
        return JSON.parse(JSON.stringify(object, jsonReplacer))
    } catch (err) {
        console.error(err)
    }
}

function jsonReplacer(key, value) {
    const name = value.constructor.name;
    // console.log(name)
    // console.log(value)
    if (name !== 'String' && name !== 'Number' &&
        name !== 'Object' && value.constructure) {
        return value.constructure
    }
    return value;
}
