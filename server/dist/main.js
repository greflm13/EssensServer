"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var debugsx = require("debug-sx");
var http = require("http");
var fs = require("fs");
process.env['DEBUG'] = '*';
process.env['DEBUG_COLORS'] = 'true';
process.env['DEBUG_STREAM'] = 'stdout';
var date = new Date().toISOString();
var debug = debugsx.createFullLogger('main');
var consolelogger = debugsx.createConsoleHandler('stdout', '*', '-*', [
    { level: /INFO*/, color: 'cyan', inverse: true },
    { level: /FINE*/, color: 'white', inverse: true },
    { level: /SEVERE*/, color: 'red', inverse: true },
    { level: 'ERR', color: 'red', inverse: true },
    { level: 'WARN', color: 'magenta', inverse: true }
]);
var filelogger = debugsx.createFileHandler(path.join(__dirname, '../logs/' + date + '.log'), '*', '-*', [
    { level: /INFO*/, color: 'cyan', inverse: true },
    { level: /FINE*/, color: 'white', inverse: true },
    { level: /SEVERE*/, color: 'red', inverse: true },
    { level: 'ERR', color: 'red', inverse: true },
    { level: 'WARN', color: 'magenta', inverse: true }
]);
debugsx.addHandler(consolelogger, filelogger);
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
var pugEngine = app.set('view engine', 'pug');
pugEngine.locals.pretty = true;
app.use(logger);
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../../ng2/dist/assets')));
app.use(express.static(path.join(__dirname, '../../ng2/dist')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.post('/api/putMeHere', putMeHere);
app.get('/api/callMeMaybe', callMeMaybe);
app.get('/delete', del);
app.get('/essen', essen);
app.post('/essen', saveEssen);
app.get('**', function (req, res) {
    res.sendFile(path.join(__dirname, '../../ng2/dist/index.html'));
});
app.use(error404Handler);
app.use(errorHandler);
var port = 8080;
var server = http.createServer(app).listen(port, function () {
    debug.info('Server running on port ' + port);
    server.on('close', function () {
        debug.fine('Server stopped.');
    });
    server.on('err', function (err) {
        debug.severe(err);
    });
});
var storedpass = 'enter';
var storeduser = 'enter';
var jsonToken = false;
function error404Handler(req, res, next) {
    var clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.warn('Error 404 for %s %s from %s', req.method, req.url, clientSocket);
    res.status(404).sendFile(path.join(__dirname, 'views/error404.html'));
}
function errorHandler(err, req, res, next) {
    var ts = new Date().toLocaleString();
    debug.severe('Error %s\n%e', ts, err);
    res.status(500).render('error500.pug', {
        time: ts,
        err: err,
        href: 'mailto:greflm13@htl-kaindorf.ac.at?subject=Füttr server failed ' + ts,
        serveradmin: 'Florian Greistorfer'
    });
}
function essen(req, res, next) {
    res.sendFile(path.join(__dirname, '/views/essen.html'));
}
function saveEssen(req, res, next) {
    fs.writeFileSync(path.join(__dirname, '../speisen.json'), JSON.stringify(req.body));
    res.redirect('/');
}
function callMeMaybe(req, res, next) {
    switch (req.query.q) {
        case 'schuelers': {
            res.sendFile(path.join(__dirname, '../essen.json'));
            break;
        }
        case 'essen': {
            res.sendFile(path.join(__dirname, '../speisen.json'));
            break;
        }
        default: {
            error404Handler(req, res, next);
        }
    }
}
function putMeHere(req, res, next) {
    var OK = {
        ok: 'ok'
    };
    switch (req.query.q) {
        case 'schuelers': {
            fs.writeFileSync(path.join(__dirname, '../essen.json'), JSON.stringify(req.body));
            res.sendFile(path.join(__dirname, '../essen.json'));
            break;
        }
        default: {
            error404Handler(req, res, next);
        }
    }
}
function del(req, res, next) {
    fs.writeFileSync(path.join(__dirname, '../essen.json'), '[]');
    fs.writeFileSync(path.join(__dirname, '../speisen.json'), '{"montag":"","dienstag":"","mittwoch":"","donnerstag":"","freitag":""}');
    res.redirect('/');
}
function logger(req, res, next) {
    var clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.info(req.method, req.url, clientSocket);
    next();
}

//# sourceMappingURL=main.js.map
