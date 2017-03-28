module.exports = function(callback) {
    return function(req, res, next) {
        req.user = callback(req.psid)
        next()
    }
}
