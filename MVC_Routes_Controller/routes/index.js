const routeHome = require('./RouteHome')
const routeRegister = require('./RouteRegistration')
const listRegistration = require('./RouteListRegistration')
//const confirmation = require('./RouteConfirmation')

function route(app) {
    //app.get('/', routeHome)

    app.use('/register', routeRegister)


    app.use('/', routeHome);
    var arrRegis = [];
}

module.exports = route;