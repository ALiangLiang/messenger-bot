/**
 * Module dependencies.
 * @private
 */
const request = require('request')
const util = require('util')
    // request.debug = true

/**
 * Expose `send`.
 */

module.exports = function send(body, node = 'messages') {
    if (!this.PAGE_ACCESS_TOKEN) {
        console.error('Need page access token to use send function.')
        return
    }

    let formData = {}

    if (body.recipient) {
        formData.recipient = JSON.stringify(body.recipient)
        formData.message = serializer(body.message)
        if(body.filedata)
        formData.filedata = body.filedata
    } else {
        formData = serializer(body)
    }

    console.log('send:')
    if (!formData.filedata)
        console.log(formData)
    else
        console.log(util.inspect(formData), {
            showHidden: false,
            depth: null
        })

    request({
        url: `https://graph.facebook.com/${this.API_VERSION}/me/${node}`,
        method: 'POST',
        qs: {
            access_token: this.PAGE_ACCESS_TOKEN
        },
        formData: formData
    }, response)
}

function response(err, response, body) {
    if (err) {
        console.error(err)
        throw err
    }
    console.log(body)
}

function serializer(object) {
    try {
        return JSON.stringify(object, jsonReplacer)
    } catch (err) {
        console.error(err)
    }
}

function jsonReplacer(key, value) {
    if (value && value.constructure) {
        return value.constructure
    }
    return value;
}
