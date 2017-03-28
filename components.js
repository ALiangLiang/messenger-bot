/**
 * Module dependencies.
 * @private
 */
var url = require('url')

class basic {
    constructor(constructure = {}) {
        this._constructure = constructure
    }

    set constructure(constructure) {}

    get constructure() {
        return this._constructure
    }
}

/**
 * Expose `Components`.
 */

module.exports = function(option) {
    const strict = option.strict

    const
        multimedias = {
            image: class image extends basic {},
            audio: class audio extends basic {},
            video: class video extends basic {},
            file: class file extends basic {}
        },
        multimediaHandle = function(type) {
            /**
             * Serialize image | file | audio | video structure.
             *
             * @param {String | Buffer} url or buffer of image | file | audio | video 
             * @return {Object}
             * @api public
             */
            return class extends multimedias[type] {
                constructor(urlOrBuffer) {
                    super()

                    // In strict mode, will check the multimedia type and multimedia is a valid url.
                    if (strict && typeof urlOrBuffer === 'string') {
                        var result = url.parse(urlOrBuffer)
                        if (!result.hostname) {
                            console.error(`Invalid ${type} url`)
                            return new Error(`Invalid ${type} url`)
                        }
                    }

                    this._constructure = {
                        attachment: {
                            type: type,
                            paylaod: {
                                url: urlOrBuffer
                            }
                        }
                    }
                }
            }
        }

    const components = {
        /**
         * Serialize text structure.
         *
         * @param {String} text
         * @return {Object}
         * @api public
         */
        text: class text extends basic {
            constructor(text) {
                super()
                this._constructure = {
                    text: text
                }
            }
        },

        // button: function(url, title) {
        //     return {
        //         type: web_url,
        //         url: https://petersfancyapparel.com/criteria_selector,
        //         title: Select Criteria,
        //         webview_height_ratio: full,
        //         messenger_extensions: true,
        //         fallback_url: https://petersfancyapparel.com/fallback
        //     }
        // },
    }

    // setup multimedia components
    Object.keys(multimedias).forEach((multimedia) => {
        var tmp = {}
        tmp[multimedia] = multimediaHandle(multimedia)
        Object.assign(components, tmp)
    })

    return components
}
