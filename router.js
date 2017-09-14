var parseUrl = require('parseurl')

module.exports = Router

function Router(option) {
    return function router(req, res, next) {
        router.handle(req, res, next)
    }
}

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

/**
 * Dispatch a req, res into the router.
 *
 * @private
 */

Router.prototype.handle = function handle(req, res, callback) {
    if (!callback) {
        throw new TypeError('argument callback is required')
    }

    var idx = 0
    var methods
    var self = this
    var slashAdded = false
    var paramcalled = {}

    // middleware and routes
    var stack = this.stack

    // manage inter-router variables
    var parentParams = req.params
    var done = restore(callback, req, 'baseUrl', 'next', 'params')

    // setup next layer
    req.next = next

    next()

    function next(err) {
        var layerError = err === 'route' ?
            null :
            err

        // remove added slash
        if (slashAdded) {
            req.url = req.url.substr(1)
            slashAdded = false
        }

        // signal to exit router
        if (layerError === 'router') {
            defer(done, null)
            return
        }

        // no more matching layers
        if (idx >= stack.length) {
            defer(done, layerError)
            return
        }

        // get pathname of request
        var path = getPathname(req)

        if (path == null) {
            return done(layerError)
        }

        // find next matching layer
        var layer
        var match
        var route

        while (match !== true && idx < stack.length) {
            layer = stack[idx++]
            match = matchLayer(layer, path)
            route = layer.route

            if (typeof match !== 'boolean') {
                // hold on to layerError
                layerError = layerError || match
            }

            if (match !== true) {
                continue
            }

            if (!route) {
                // process non-route handlers normally
                continue
            }

            if (layerError) {
                // routes do not match with a pending error
                match = false
                continue
            }

            var method = req.method;
            var has_method = route._handles_method(method)

            // build up automatic options response
            if (!has_method && method === 'OPTIONS' && methods) {
                methods.push.apply(methods, route._methods())
            }

            // don't even bother matching route
            if (!has_method && method !== 'HEAD') {
                match = false
                continue
            }
        }

        // no match
        if (match !== true) {
            return done(layerError)
        }

        // store route for dispatch on change
        if (route) {
            req.route = route
        }

        // Capture one-time layer values
        req.params = self.mergeParams ?
            mergeParams(layer.params, parentParams) :
            layer.params
        var layerPath = layer.path

        // this should be done for the layer
        self.process_params(layer, paramcalled, req, res, function(err) {
            if (err) {
                return next(layerError || err)
            }

            if (route) {
                return layer.handle_request(req, res, next)
            }

            trim_prefix(layer, layerError, layerPath, path)
        })
    }
}

/**
 * Restore obj props after function
 *
 * @private
 */

function restore(fn, obj) {
  var props = new Array(arguments.length - 2)
  var vals = new Array(arguments.length - 2)

  for (var i = 0; i < props.length; i++) {
    props[i] = arguments[i + 2]
    vals[i] = obj[props[i]]
  }

  return function(){
    // restore vals
    for (var i = 0; i < props.length; i++) {
      obj[props[i]] = vals[i]
    }

    return fn.apply(this, arguments)
  }
}

/**
 * Get pathname of request.
 *
 * @param {IncomingMessage} req
 * @private
 */

function getPathname(req) {
    try {
        return parseUrl(req).pathname;
    } catch (err) {
        return undefined;
    }
}
