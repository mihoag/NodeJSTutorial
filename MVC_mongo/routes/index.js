const studentRoute = require('./StudentRoute')

function routes(app) {
    app.use('/student', studentRoute);
}

module.exports = routes