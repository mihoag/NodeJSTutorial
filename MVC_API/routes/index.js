const bookRoute = require('./bookRouter')

function route(app) {
   app.use('/book', bookRoute);
}
module.exports = route