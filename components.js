/**
 * Module dependencies.
 * @private
 */
const
    Url = require('url'),
    Joi = require('joi')

let strictMode = false


/**
 * Expose `Components`.
 */

module.exports = function(option) {
    global.strictMode = strictMode = option.strictMode

    const
        Multimedias = {
            image: class Image extends require('./components/Basic') {},
            audio: class Audio extends require('./components/Basic') {},
            video: class Video extends require('./components/Basic') {},
            file: class File extends require('./components/Basic') {}
        },
        multimediaHandle = function(type) {
            /**
             * Serialize image | file | audio | video structure.
             *
             * @param {String | Buffer} url or buffer of image | file | audio | video 
             * @return {Object}
             * @api public
             */
            return class extends Multimedias[type] {
                constructor(urlOrBuffer) {
                    super()

                    // In strictMode mode, will check the multimedia type and multimedia is a valid url.
                    if (strictMode && typeof urlOrBuffer === 'string') {
                        if (!isValidUrl(urlOrBuffer)) {
                            console.error(`The ${type} should represent a valid URL`)
                            return new Error(`The ${type} should represent a valid URL`)
                        }
                    }

                    this._constructure = {
                        attachment: {
                            type: type,
                            payload: {
                                url: urlOrBuffer
                            }
                        }
                    }
                }
            }
        }

    const components = {
        /**
         * Serialize get_started structure.
         *
         * @param {String} payload
         * @return {Object}
         * @api public
         */
        getStarted: require('./components/GetStarted'),

        /**
         * Serialize greeting structure.
         *
         * @param {greetingItem[]} greeting items
         * @return {Object}
         * @api public
         */
        greeting: require('./components/Greeting'),

        /**
         * Serialize greeting item structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        greetingItem: require('./components/GreetingItem'),

        /**
         * Serialize quick reply structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        quickReply: require('./components/QuickReply'),

        /**
         * Serialize quick reply item structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        quickReplyItem: require('./components/QuickReplyItem'),

        /**
         * Serialize text structure.
         *
         * @param {String} text
         * @return {Object}
         * @api public
         */
        text: require('./components/Text'),

        template: {

            /**
             * Serialize text structure.
             *
             * @param {String} title
             * @param {Button[]} buttons
             * @return {Object}
             * @api public
             */
            button: require('./components/Template/Button'),

            /**
             * Serialize generic template structure.
             *
             * @param {TemplateElement[]} elements
             * @return {Object}
             * @api public
             */
            generic: require('./components/Template/Generic'),

            /**
             * Serialize list template structure.
             *
             * @param {TemplateElement[]} elements
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            list: class Template_List extends require('./components/Basic') {
                constructor(elements, option = {}) {
                    super()
                    let
                        payload = {
                            template_type: 'list',
                            top_element_style: option.topElementStyle || 'large',
                            buttons: option.buttons
                        },
                        constructure = {
                            attachment: {
                                type: 'template',
                                payload: payload
                            }
                        }

                    if (strictMode) {
                        if (elements < 2 || elements > 4) {
                            console.error(`The elements length should between 2 to 4`)
                            throw new Error(`The elements length should between 2 to 4`)
                        }
                        if (option.buttons && option.buttons.length > 1) {
                            console.error(`The buttons length should between 0 to 1`)
                            throw new Error(`The buttons length should between 0 to 1`)
                        }
                    }

                    Object.assign(payload, {
                        elements: elements
                    })
                    this._constructure = constructure
                }
            },

            /**
             * Serialize receipt template structure.
             *
             * @param {TemplateElement[]} elements
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            receipt: class Template_Receipt extends require('./components/Basic') {
                constructor(recipient_name, order_number, currency, payment_method, summary, option = {}) {
                    super()
                    let
                        payload = {
                            template_type: 'receipt',
                            recipient_name: recipient_name,
                            recipient_name: option.recipient_name,
                            order_number: order_number,
                            currency: currency,
                            payment_method: payment_method,
                            timestamp: option.timestamp,
                            order_url: option.order_url,
                            elements: option.elements,
                            address: option.address,
                            summary: summary,
                        },
                        constructure = {
                            attachment: {
                                type: 'template',
                                payload: payload
                            }
                        }

                    if (strictMode) {
                        if (option.elements.length > 100) {
                            console.error(`The elements length should between 0 to 100`)
                            throw new Error(`The elements length should between 0 to 100`)
                        }
                    }

                    this._constructure = constructure
                }
            }
        },

        templateElement: {

            /**
             * Serialize generic template element structure.
             *
             * @param {String} title
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            generic: require('./components/Template/Generic').element,

            /**
             * Serialize list template element structure.
             *
             * @param {String} title
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            list: class TemplateElement_List extends require('./components/Basic') {
                constructor(title, option = {}) {
                    super()

                    if (strictMode && option.buttons && option.buttons.length) {
                        if (option.buttons.length > 1) {
                            console.error(`The buttons length should between 0 to 1`)
                            throw new Error(`The buttons length should between 0 to 1`)
                        }
                    }

                    let
                        constructure = {
                            title: title,
                            image_url: option.imageUrl,
                            subtitle: option.subtitle,
                            default_action: option.defaultAction,
                            buttons: option.buttons,
                        }

                    this._constructure = constructure
                }
            }
        },

        /**
         * Serialize price structure.
         *
         * @param {String} label
         * @param {String} amount
         * @return {Object}
         * @api public
         */
        price: class Price extends require('./components/Basic') {
            constructor(label, amount) {
                super()

                this._constructure = {
                    label: label,
                    amount: amount
                }
            }
        },

        /**
         * Serialize adjustments structure.
         *
         * @param {Object} options
         * @return {Object}
         * @api public
         */
        adjustments: class Adjustments extends require('./components/Basic') {
            constructor(option) {
                super()

                this._constructure = {
                    name: option.name,
                    amount: option.amount
                }
            }
        },

        button: {

            /**
             * Serialize url button structure.
             *
             * @param {String} title
             * @param {String} url
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            url: require('./components/Button/Url'),

            /**
             * Serialize postback button structure.
             *
             * @param {String} title
             * @param {String} payload
             * @return {Object}
             * @api public
             */
            postback: require('./components/Button/Postback'),

            /**
             * Serialize phone number button structure.
             *
             * @param {String} title
             * @param {String} phoneNumber
             * @return {Object}
             * @api public
             */
            phoneNumber: require('./components/Button/PhoneNumber'),

            /**
             * Serialize element share button structure.
             *
             * @return {Object}
             * @api public
             */
            elementShare: require('./components/Button/ElementShare'),

            /**
             * Serialize payment button structure.
             *
             * @param {String} payload
             * @param {String} currency
             * @param {String} paymentType
             * @param {String} merchantName
             * @param {String} requestedUserInfo
             * @param {Price[]} priceList
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            payment: class Button_Payment extends require('./components/Basic') {
                constructor(payload, currency, paymentType, merchantName, requestedUserInfo, priceList, option = {}) {
                    super()

                    this._constructure = {
                        type: 'payment',
                        title: 'Buy',
                        payload: payload,
                        payment_summary: {
                            currency: currency,
                            payment_type: paymentType,
                            is_test_payment: option.isTestPayment,
                            merchant_name: merchantName,
                            requested_user_info: requestedUserInfo,
                            price_list: priceList,
                        }
                    }
                }
            },

            /**
             * Serialize account link button structure.
             *
             * @param {String} url
             * @return {Object}
             * @api public
             */
            accountLink: require('./components/Button/AccountLink'),

            /**
             * Serialize account unlink button structure.
             *
             * @return {Object}
             * @api public
             */
            accountUnlink: require('./components/Button/AccountUnlink')
        },
    }

    // setup multimedia components
    Object.keys(Multimedias).forEach((multimedia) => {
        var tmp = {}
        tmp[multimedia] = multimediaHandle(multimedia)
        Object.assign(components, tmp)
    })

    return components
}

function isValidUrl(url) {
    var result = Url.parse(url)
    return Boolean(result.hostname)
}
