/**
 * Module dependencies.
 * @private
 */
const request = require('request')
const util = require('util')
    // request.debug = true


class Communication {

    constructor(apiVersion, pageAccessToken) {
        if (!pageAccessToken) {
            console.error('Need page access token to use send function.')
            return
        }

        this.API_VERSION = apiVersion
        this.PAGE_ACCESS_TOKEN = pageAccessToken
    }

    send(id, message, filedata) {
        let formData = {}

        formData.recipient = `{id: ${id}}`
        formData.message = serializer(message)
        if (filedata)
            formData.filedata = filedata

        console.log('send:')
        if (!formData.filedata)
            console.log(formData)
        else
            console.log(util.inspect(formData), {
                showHidden: false,
                depth: null
            })

        request({
            url: `https://graph.facebook.com/${this.API_VERSION}/me/messages`,
            method: 'POST',
            qs: {
                access_token: this.PAGE_ACCESS_TOKEN
            },
            formData: formData
        }, response)
    }

    setting(body) {
        console.log('send:')
        console.log(body, {
            showHidden: false,
            depth: null
        })

        request({
            url: `https://graph.facebook.com/${this.API_VERSION}/me/messenger_profile`,
            method: 'POST',
            qs: {
                access_token: this.PAGE_ACCESS_TOKEN
            },
            json: true,
            body: body,
            jsonReplacer: jsonReplacer
        }, response)
    }

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

/**
 * Expose `Communication`.
 */

module.exports = Communication
