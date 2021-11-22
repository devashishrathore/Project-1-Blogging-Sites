let captureInfo = function (req, res, next) {
    let acceptHeaderValue = req.headers['accept']
    req.headers['batch']='Radium'
    console.log('Global middleware called')
    res.send('Global middleware called')
}

module.exports.captureInfo = captureInfo