/**
 * Module dependencies.
 * @private
 */
const request = require('request')


/**
 * Expose `send`.
 */
 
module.exports = function send(body) {
    function response(error, response, body) {
        if (error) {
            console.error(error)
            throw error
        }
    }
    console.log('send:')
    console.log(body)
        // request(`https://graph.facebook.com/${API_VERSION}/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, response)
}
