/**
 * Module dependencies.
 * @private
 */
const
    http = require('http'),
    util = require('util'),
    crypto = require('crypto'),
    parse = require('co-body'),
    Url = require('url'),
    qs = require('querystring'),
    send = require('./send')

let
    APP_SECRET,
    VERIFY_TOKEN = ''

/**
 * Initialize `Interface` with given option,
 *
 * @param {Object} option
 * @api public
 */
module.exports = function(option = {}) {
    if (!option.appSecret)
        console.warn('For security reason, you should provide a app secret code.')
    if (!option.pageAccessToken)
        console.warn('You need provide page access token to use send function.')
    if (!option.verifyToken)
        console.warn('If you want to turn on the "verify webhhok" function, you need provide a verify token.')
    send.prototype.API_VERSION = option.apiVersion || 'v2.8'
    send.prototype.PAGE_ACCESS_TOKEN = option.pageAccessToken
    Interface.send = send
    VERIFY_TOKEN = option.verifyToken
    APP_SECRET = option.appSecret
    return Interface
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Router} botRouter
 * @param {Function} handler
 * @api public
 */
const Interface = async function(req, res, botRouter, handler) {

    // Used to verify webhook
    if (VERIFY_TOKEN) {
        if (req.method.toLowerCase() === 'get') {
            req.query = qs.parse(Url.parse(req.url).query)
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === VERIFY_TOKEN) {
                console.info('Validating webhook')
                res.statusCode = 200
                res.end(req.query['hub.challenge'])
            } else {
                console.error('Failed validation. Make sure the validation tokens match.')
                res.statusCode = 403
                res.end()
            }
            return
        }
    }

    // End the response
    res.end()

    // Parse the body to text
    const text = await parse.text(req)

    // If provide a app secret code, check the request is valid.
    if (APP_SECRET) {
        let hmac = crypto.createHmac('sha1', APP_SECRET)
        hmac.update(text)
        if (req.headers['x-hub-signature'] !== `sha1=${hmac.digest('hex')}`) {
            console.error('Message integrity check failed')
            return
        }
    }

    // Parse the body to json
    const body = JSON.parse(text)

    try {
        if (body.object === 'page' && body.entry && body.entry.length)
            body.entry.forEach((entry) =>
                entry.messaging.forEach((msg) => {
                    const userPsid = msg.sender.id

                    // Classfy the data array by method property
                    const data = {}
                    normalize(msg)
                        .forEach((e) => {
                            if (!data[e.method])
                                data[e.method] = [e]
                            else
                                data[e.method].push(e)
                        })

                    Object.keys(data).forEach((method) => {
                        const req = new http.IncomingMessage
                        req.body = msg
                        req.psid = userPsid
                        req.method = method
                        req.data = data[method]

                        // setup res.send
                        res.send = function(body) {
                            // Construct basic body structure
                            let structure = {
                                recipient: {
                                    id: req.psid
                                },
                                message: body
                            }

                            // Send the body
                            new send(structure)
                        }

                        botRouter(req, res, handler)
                    })

                }))
    } catch (e) {
        console.error(e)
    }

}

/**
 * @param {Object} body
 * @api public
 */
function normalize(body) {
    console.log(util.inspect(body, {
        showHidden: false,
        depth: null
    }))

    let data = []

    if (body.message) {
        const message = body.message

        // text
        if (message.text && !message.quick_reply) {
            data.push({
                method: 'TEXT',
                text: message.text
            })
        }
        // quick reply
        else if (message.text && message.quick_reply) {
            data.push({
                method: 'REPLY',
                payload: message.quick_reply.payload
            })
        }
        // attachment
        else if (message.attachments && message.attachments.length !== 0) {
            message.attachments.forEach((attachment) => {
                let _data = {}
                switch (attachment.type) {
                    case 'audio':
                    case 'file':
                    case 'image':
                    case 'video':
                        _data[attachment.type] = attachment.payload.url
                        break
                    case 'fallback':
                        _data.title = attachment.title
                    case 'location':
                        _data.coordinates = attachment.coordinates
                        _data[attachment.type] = attachment.url
                        break
                    default:
                        throw new Error('Unknown method')
                }
                _data.method = attachment.type.toUpperCase()
                data.push(_data)
            })
        }
    }
    // postback
    else if (body.postback && body.postback.payload) {
        data.push({
            method: 'POSTBACK',
            payload: body.postback.payload
        })
    }
    // read
    else if (body.read) {
        data.push({
            method: 'READ',
            watermark: body.read.watermark,
            seq: body.read.seq
        })
    }
    // unknown type
    else {
        console.error(body)
        throw new Error('No matched method')
    }
    return data
}
