/**
 * Module dependencies.
 * @private
 */
var Url = require('url')

class Basic {
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
        Multimedias = {
            image: class Image extends Basic {},
            audio: class Audio extends Basic {},
            video: class Video extends Basic {},
            file: class File extends Basic {}
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

                    // In strict mode, will check the multimedia type and multimedia is a valid url.
                    if (strict && typeof urlOrBuffer === 'string') {
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
        getStarted: class getStarted extends Basic {
            constructor(payload) {
                super()
                this._constructure = {
                    get_started: {
                        payload: payload
                    }
                }
            }
        },

        /**
         * Serialize greeting structure.
         *
         * @param {greetingItem[]} greeting items
         * @return {Object}
         * @api public
         */
        greeting: class Greeting extends Basic {
            constructor(greetingItems) {
                super()
                this._constructure = {
                    greeting: greetingItems
                }
            }
        },

        /**
         * Serialize greeting item structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        greetingItem: class GreetingItem extends Basic {
            constructor(text, locale) {
                super()
                this._constructure = {
                    text: text,
                    locale: locale
                }
            }
        },

        /**
         * Serialize quick reply structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        quickReply: class QuickReply extends Basic {
            constructor(text, quickReplies) {
                super()
                this._constructure = {
                    text: text,
                    quick_replies: quickReplies
                }
            }
        },

        /**
         * Serialize quick reply item structure.
         *
         * @param {String} text
         * @param {String} locale
         * @return {Object}
         * @api public
         */
        quickReplyItem: class QuickReplyItem extends Basic {
            constructor(contentType, option = {}) {
                super()
                this._constructure = {
                    title: option.title,
                    content_type: contentType,
                    payload: option.payload,
                    image_url : option.imageUrl
                }
            }
        },

        /**
         * Serialize text structure.
         *
         * @param {String} text
         * @return {Object}
         * @api public
         */
        text: class Text extends Basic {
            constructor(text) {
                super()
                this._constructure = {
                    text: text
                }
            }
        },

        template: {

            /**
             * Serialize text structure.
             *
             * @param {String} title
             * @param {Button[]} buttons
             * @return {Object}
             * @api public
             */
            button: class Template_Button extends Basic {
                constructor(title, buttons) {
                    super()
                    let
                        payload = {
                            template_type: 'button',
                            text: title
                        },
                        constructure = {
                            attachment: {
                                type: 'template',
                                payload: payload
                            }
                        }

                    if (strict) {
                        if (buttons < 1 || buttons > 3) {
                            console.error(`The buttons length should between 1 to 3`)
                            throw new Error(`The buttons length should between 1 to 3`)
                        }
                    }
                    Object.assign(payload, {
                        buttons: buttons,
                    })
                    this._constructure = constructure
                }
            },

            /**
             * Serialize generic template structure.
             *
             * @param {TemplateElement[]} elements
             * @return {Object}
             * @api public
             */
            generic: class Template_Generic extends Basic {
                constructor(elements) {
                    super()
                    let
                        payload = {
                            template_type: 'generic'
                        },
                        constructure = {
                            attachment: {
                                type: 'template',
                                payload: payload
                            }
                        }

                    if (strict) {
                        if (elements < 1 || elements > 5) {
                            console.error(`The buttons length should between 1 to 5`)
                            throw new Error(`The buttons length should between 1 to 5`)
                        }
                    }

                    Object.assign(payload, {
                        elements: elements
                    })
                    this._constructure = constructure
                }
            },

            /**
             * Serialize list template structure.
             *
             * @param {TemplateElement[]} elements
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            list: class Template_List extends Basic {
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

                    if (strict) {
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
            receipt: class Template_Receipt extends Basic {
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

                    if (strict) {
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
            generic: class TemplateElement_Generic extends Basic {
                constructor(title, option = {}) {
                    super()

                    if (strict && option.buttons && option.buttons.length) {
                        if (option.buttons.length > 3 && option.buttons.length < 1) {
                            console.error(`The buttons length should between 1 to 3`)
                            throw new Error(`The buttons length should between 1 to 3`)
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
            },

            /**
             * Serialize list template element structure.
             *
             * @param {String} title
             * @param {Object} options
             * @return {Object}
             * @api public
             */
            list: class TemplateElement_List extends Basic {
                constructor(title, option = {}) {
                    super()

                    if (strict && option.buttons && option.buttons.length) {
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
        price: class Price extends Basic {
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
        adjustments: class Adjustments extends Basic {
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
            url: class Button_Url extends Basic {
                constructor(title, url, option = {}) {
                    super()

                    if (strict && typeof url === 'string') {
                        if (!isValidUrl(url)) {
                            console.error(`The web_url should represent a valid URL`)
                            throw new Error(`The web_url should represent a valid URL`)
                        }
                    }

                    this._constructure = {
                        type: 'web_url',
                        title: title,
                        url: url,
                        webview_height_ratio: option.webview_height_ratio,
                        messenger_extensions: option.messenger_extensions,
                        fallback_url: option.fallback_url
                    }
                }
            },

            /**
             * Serialize postback button structure.
             *
             * @param {String} title
             * @param {String} payload
             * @return {Object}
             * @api public
             */
            postback: class Button_Postback extends Basic {
                constructor(title, payload) {
                    super()

                    if (strict && typeof title === 'string') {
                        if (title.length > 20) {
                            console.error(`The title length should less then 20`)
                            throw new Error(`The title length should less then 20`)
                        }
                    }

                    this._constructure = {
                        type: 'postback',
                        title: title,
                        payload: payload
                    }
                }
            },

            /**
             * Serialize phone number button structure.
             *
             * @param {String} title
             * @param {String} phoneNumber
             * @return {Object}
             * @api public
             */
            phoneNumber: class Button_PhoneNumber extends Basic {
                constructor(title, phoneNumber) {
                    super()

                    if (strict && typeof title === 'string') {
                        if (title.length > 20) {
                            console.error(`The title length should less then 20`)
                            throw new Error(`The title length should less then 20`)
                        }
                    }

                    this._constructure = {
                        type: 'phone_number',
                        title: title,
                        payload: phoneNumber
                    }
                }
            },

            /**
             * Serialize element share button structure.
             *
             * @return {Object}
             * @api public
             */
            elementShare: class Button_ElementShare extends Basic {
                constructor() {
                    super()

                    this._constructure = {
                        type: 'element_share'
                    }
                }
            },

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
            payment: class Button_Payment extends Basic {
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
            accountLink: class Button_AccountLink extends Basic {
                constructor(url) {
                    super()

                    if (strict && typeof url === 'string') {
                        if (!isValidUrl(url)) {
                            console.error(`The web_url should represent a valid URL`)
                            throw new Error(`The web_url should represent a valid URL`)
                        }
                    }

                    this._constructure = {
                        type: 'account_link',
                        url: url
                    }
                }
            },

            /**
             * Serialize account unlink button structure.
             *
             * @return {Object}
             * @api public
             */
            accountUnlink: class Button_accountUnlink extends Basic {
                constructor() {
                    super()

                    this._constructure = {
                        type: 'account_unlink'
                    }
                }
            }
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
