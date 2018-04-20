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
let date = new Date().toLocaleDateString();
let time = new Date();
const debug: debugsx.IFullLogger = debugsx.createFullLogger('main');
let consolelogger: debugsx.IHandler = debugsx.createConsoleHandler('stdout', '*', '-*', [
  { level: /INFO*/, color: 'cyan', inverse: true },
  { level: /FINE*/, color: 'white', inverse: true },
  { level: /SEVERE*/, color: 'red', inverse: true },
  { level: 'ERR', color: 'red', inverse: true },
  { level: 'WARN', color: 'magenta', inverse: true }
]);
let filelogger: debugsx.IHandler = debugsx.createFileHandler(
  path.join(
    __dirname,
    '../logs/' + date + '_' + time.getHours() + '-' + time.getMinutes() + '-' + time.getSeconds() + '-' + time.getMilliseconds() + '.log'
  ),
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
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, './public/favicon.ico')));
app.use(express.static(path.join(__dirname, './public')));
app.use('/assets', express.static(path.join(__dirname, '../../ngx/dist/assets')));
app.use(express.static(path.join(__dirname, '../../ngx/dist')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.post('/api/putMeHere/:data', putMeHere);
app.post('/leaderboard', postLeaderboard);
app.get('/leaderboard', getLeaderboard);
app.get('/api/callMeMaybe/:data', callMeMaybe);
app.get('/delete', del);
app.get('/lock', lock);
app.get('/unlock', unlock);
app.post('/essen', saveEssen);
app.get('**', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ngx/dist/index.html'));
});
app.use(error404Handler);
app.use(errorHandler);

const appredirect = express();
appredirect.get('*', function(req, res) {
  res.redirect('https://' + req.headers.host + req.url);
});

const httpport = 8080;
const httpsport = 8443;
const privKey = fs.readFileSync(path.join(__dirname, '../privkey.pem'), 'utf8');
const cert = fs.readFileSync(path.join(__dirname, '../fullchain.pem'), 'utf8');
const credentials = { key: privKey, cert: cert };
const server = http.createServer(appredirect).listen(httpport, () => {
  debug.info('HTTP Server running on port ' + httpport);
  server.on('close', () => {
    debug.fine('HTTP Server stopped.');
  });
  server.on('err', err => {
    debug.severe(err);
  });
});

const sserver = https.createServer(credentials, app).listen(httpsport, () => {
  debug.info('HTTPS Server running on port ' + httpsport);
  sserver.on('close', () => {
    debug.fine('HTTPS Server stopped.');
  });
  sserver.on('err', err => {
    debug.severe(err);
  });
});

function error404Handler(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
  debug.warn('Error 404 for %s %s from %s', req.method, req.url, clientSocket);
  res.status(404).sendFile(path.join(__dirname, 'views/error404.html'));
}

function errorHandler(err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) {
  const ts = new Date().toLocaleString();
  if (err.toString().startsWith('Error: ENOENT')) {
    res.sendFile(path.join(__dirname, './views/update.html'));
    debug.warn('Update deploying...');
  } else {
    debug.severe('Error %s\n%e', ts, err);
    res.status(500).render('error500.pug', {
      time: ts,
      err: err,
      href: 'mailto:greflm13@htl-kaindorf.ac.at?subject=Füttr server failed ' + ts + ' with Error: ' + err,
      serveradmin: 'Florian Greistorfer'
    });
  }
}

function essen(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.sendFile(path.join(__dirname, '/views/essen.html'));
}

function saveEssen(req: express.Request, res: express.Response, next: express.NextFunction) {
  fs.writeFileSync(path.join(__dirname, '../speisen.json'), JSON.stringify(req.body));
}

function callMeMaybe(req: express.Request, res: express.Response, next: express.NextFunction) {
  switch (req.params.data) {
    case 'schuelers': {
      res.sendFile(path.join(__dirname, '../essen.json'));
      break;
    }

    case 'essen': {
      res.sendFile(path.join(__dirname, '../speisen.json'));
      break;
    }

    case 'last': {
      res.sendFile(path.join(__dirname, '../letzte_woche.json'));
      break;
    }

    case 'lastessen': {
      res.sendFile(path.join(__dirname, '../letzte_woche_speisen.json'));
      break;
    }

    case 'lockstate': {
      res.sendFile(path.join(__dirname, '../lockfile.json'));
      break;
    }

    default: {
      error404Handler(req, res, next);
    }
  }
}

function putMeHere(req: express.Request, res: express.Response, next: express.NextFunction) {
  switch (req.params.data) {
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
  const last = fs.readFileSync(path.join(__dirname, '../essen.json'));
  const lastfood = fs.readFileSync(path.join(__dirname, '../speisen.json'));
  fs.writeFileSync(path.join(__dirname, '../lockfile.json'), '{"lock":false}');
  fs.writeFileSync(path.join(__dirname, '../letzte_woche.json'), last);
  fs.writeFileSync(path.join(__dirname, '../letzte_woche_speisen.json'), lastfood);
  fs.writeFileSync(path.join(__dirname, '../essen.json'), '[]');
  fs.writeFileSync(path.join(__dirname, '../speisen.json'), '{"montag":"","dienstag":"","mittwoch":"","donnerstag":"","freitag":""}');
  res.redirect('/');
}

function logger(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
  debug.info(req.method, req.url, clientSocket);
  next();
}

function lock(req: express.Request, res: express.Response, next: express.NextFunction) {
  fs.writeFileSync(path.join(__dirname, '../lockfile.json'), '{"lock":true}');
  res.redirect('/');
}

function unlock(req: express.Request, res: express.Response, next: express.NextFunction) {
  fs.writeFileSync(path.join(__dirname, '../lockfile.json'), '{"lock":false}');
  res.redirect('/');
}

function postLeaderboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  const leaderboard: Leaderboard = { easy: [], medium: [], hard: [], people: [] };
  for (let i = 0; i < 10; i++) {
    leaderboard.easy.push(req.body.easy[i]);
    leaderboard.medium.push(req.body.medium[i]);
    leaderboard.hard.push(req.body.hard[i]);
    leaderboard.people.push(req.body.people[i]);
  }
  fs.writeFileSync(path.join(__dirname, '../leaderboard.json'), JSON.stringify(leaderboard));
  res.send(JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, '../leaderboard.json')).toString())));
}

function getLeaderboard(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send(JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, '../leaderboard.json')).toString())));
}

interface Leaderboard {
  easy: People[];
  medium: People[];
  hard: People[];
  people: People[];
}

interface People {
  name: string;
  x: number;
  y: number;
  field_size: string;
  bomb_count: number;
  time: number;
}
