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
    console.log('send:')
    console.log(util.inspect(serializer(body), {
        showHidden: false,
        depth: null
    }))
    request({
        url: `https://graph.facebook.com/${this.API_VERSION}/me/${node}`,
        method: 'POST',
        qs: {
            access_token: this.PAGE_ACCESS_TOKEN
        },
        json: true,
        body: serializer(body)
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
        return JSON.parse(JSON.stringify(object, jsonReplacer))
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
