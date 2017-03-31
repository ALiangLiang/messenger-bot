/**
 * Module dependencies.
 * @private
 */
const
    Url = require('url'),
    Joi = require('joi'),
    Basic = require('./components/Basic')

/**
 * Expose `Components`.
 */

module.exports = function(option) {
    Basic.strictMode = option.strict

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

        /**
         * Serialize image structure.
         *
         * @param {String} url
         * @return {Object}
         * @api public
         */
        image: require('./components/Image'),

        /**
         * Serialize file structure.
         *
         * @param {String} url
         * @return {Object}
         * @api public
         */
        file: require('./components/File'),

        /**
         * Serialize audio structure.
         *
         * @param {String} url
         * @return {Object}
         * @api public
         */
        audio: require('./components/Audio'),

        /**
         * Serialize video structure.
         *
         * @param {String} url
         * @return {Object}
         * @api public
         */
        video: require('./components/Video'),

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
            list: require('./components/Template/List'),

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
            list: require('./components/Template/List').element
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
             * Serialize nested button structure.
             *
             * @param {String} title
             * @param {Button_Url[] | Button_Postback[] | Button_Nested[]} callToActions
             * @param {Object} option
             * @return {Object}
             * @api public
             */
            nested: require('./components/Button/Nested'),

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

        /**
         * Serialize account unlink button structure.
         *
         * @param {PersistentMenuLocale[]} persitent menu locale array
         * @return {Object}
         * @api public
         */
        persistentMenu: require('./components/PersistentMenu'),

        /**
         * Serialize account unlink button structure.
         *
         * @param {String} locale
         * @param {Button_Url[] | Button_Postback[] | Button_Nested[]} callToActions
         * @param {Object}  option
         * @return {Object}
         * @api public
         */
        persistentMenuLocale: require('./components/PersistentMenuLocale')
    }

    return components
}

function isValidUrl(url) {
    var result = Url.parse(url)
    return Boolean(result.hostname)
}
