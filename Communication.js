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

        return new Promise((resolve, reject) =>
        request({
            url: `https://graph.facebook.com/${this.API_VERSION}/me/messages`,
            method: 'POST',
            qs: {
                access_token: this.PAGE_ACCESS_TOKEN
            },
            formData: formData
        }, response(resolve, reject)))
    }

    setting(body) {
        console.log('send:')
        console.log(body, {
            showHidden: false,
            depth: null
        })

        return new Promise((resolve, reject) =>
        request({
            url: `https://graph.facebook.com/${this.API_VERSION}/me/messenger_profile`,
            method: 'POST',
            qs: {
                access_token: this.PAGE_ACCESS_TOKEN
            },
            json: true,
            body: body,
            jsonReplacer: jsonReplacer
        }, response(resolve, reject)))
    }

    /**
     * @param {Number} id
     * @return {Object} user profile
     * @api public
     */
    profile(id) {
        const
            API_VERSION = this.API_VERSION,
            PAGE_ACCESS_TOKEN = this.PAGE_ACCESS_TOKEN

        return new Promise((resolve, reject) =>
            request({
                url: `https://graph.facebook.com/${API_VERSION}/${id}`,
                method: 'GET',
                qs: {
                    access_token: PAGE_ACCESS_TOKEN,
                    fields: 'first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled'
                },
                json:true
            }, response(resolve, reject)))
    }
}

function response(resolve, reject) {
    return (err, res, body) => (err) ? reject(err) : resolve(body)
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
