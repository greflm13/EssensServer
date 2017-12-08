import * as express from 'express';
import * as path from 'path';
import * as bodyparser from 'body-parser';
import * as debugsx from 'debug-sx';

import * as http from 'http';
import * as https from 'https';
import * as child from 'child_process';
import * as fs from 'fs';

process.env['DEBUG'] = '*';
process.env['DEBUG_COLORS'] = 'true';
process.env['DEBUG_STREAM'] = 'stdout';
let date = new Date().toISOString();
const debug: debugsx.IFullLogger = debugsx.createFullLogger('main');
let consolelogger: debugsx.IHandler = debugsx.createConsoleHandler('stdout', '*', '-*', [
    { level: /INFO*/, color: 'cyan', inverse: true },
    { level: /FINE*/, color: 'white', inverse: true },
    { level: /SEVERE*/, color: 'red', inverse: true },
    { level: 'ERR', color: 'red', inverse: true },
    { level: 'WARN', color: 'magenta', inverse: true }
]);
let filelogger: debugsx.IHandler = debugsx.createFileHandler(
    path.join(__dirname, '/log' + date + '.log'),
    '*',
    '-*',
    [
        { level: /INFO*/, color: 'cyan', inverse: true },
        { level: /FINE*/, color: 'white', inverse: true },
        { level: /SEVERE*/, color: 'red', inverse: true },
        { level: 'ERR', color: 'red', inverse: true },
        { level: 'WARN', color: 'magenta', inverse: true }
    ]
);
debugsx.addHandler(consolelogger, filelogger);

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
const pugEngine = app.set('view engine', 'pug');
pugEngine.locals.pretty = true;

app.use(logger);
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../../ng2/dist/assets')));
app.use(express.static(path.join(__dirname, '../../ng2/dist')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.post('/api/putMeHere', putMeHere);
app.get('/api/callMeMaybe', callMeMaybe);
app.get('/delete', del)
app.get('/essen', essen);
app.post('/essen', saveEssen);
app.get('**', (req, res) => { res.sendFile(path.join(__dirname, '../../ng2/dist/index.html')); });
app.use(error404Handler);
app.use(errorHandler);

const port = 17325;
const server = http.createServer(app).listen(port, () => {
    debug.info('Server running on port ' + port);
    server.on('close', () => {
        debug.fine('Server stopped.');
    });
    server.on('err', err => {
        debug.severe(err);
    });
});
const storedpass = 'enter';
const storeduser = 'enter';
let jsonToken = false;


function error404Handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.warn('Error 404 for %s %s from %s', req.method, req.url, clientSocket);
    res.status(404).sendFile(path.join(__dirname, 'views/error404.html'));
}


function errorHandler(err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) {
    const ts = new Date().toLocaleString();
    debug.severe('Error %s\n%e', ts, err);
    res.status(500).render('error500.pug', {
        time: ts,
        err: err,
        href: 'mailto:greflm13@htl-kaindorf.ac.at?subject=Füttr server failed ' + ts,
        serveradmin: 'Florian Greistorfer'
    });
}


function essen(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.sendFile(path.join(__dirname, '/views/essen.html'));
}


function saveEssen(req: express.Request, res: express.Response, next: express.NextFunction) {
    fs.writeFileSync(path.join(__dirname, '../speisen.json'), JSON.stringify(req.body));
    res.redirect('/');
}


function callMeMaybe(req: express.Request, res: express.Response, next: express.NextFunction) {
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


function putMeHere(req: express.Request, res: express.Response, next: express.NextFunction) {
    const OK = {
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


function del(req: express.Request, res: express.Response, next: express.NextFunction) {
    fs.writeFileSync(path.join(__dirname, '../essen.json'), '[]');
    fs.writeFileSync(path.join(__dirname, '../speisen.json'), '{"montag":"","dienstag":"","mittwoch":"","donnerstag":"","freitag":""}');
    res.redirect('/');
}


function logger(req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.info(req.method, req.url, clientSocket);
    next();
}
