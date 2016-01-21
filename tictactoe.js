var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var io = require('socket.io')(http);
var session = require("express-session");
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessionStore = new session.MemoryStore();

var COOKIE_SECRET = 'tinderaddict'; // use global configs in production
var COOKIE_NAME = 'sid';

var port = 8080;
var routes = {};
routes.index = require('./routes/index');
routes.api = require('./routes/api');

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(cookieParser(COOKIE_SECRET));
app.use(session({
  name: COOKIE_NAME,
  store: sessionStore,
  secret: COOKIE_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  }
}));

io.use(function(socket, next) {
  try {
    var data = socket.handshake || socket.request;

    if (! data.headers.cookie) {
      return next(new Error('Missing cookie headers'));
    }

    var cookies = cookie.parse(data.headers.cookie);

    if (! cookies[COOKIE_NAME]) {
      return next(new Error('Missing cookie ' + COOKIE_NAME));
    }

    var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);

    if (! sid) {
      return next(new Error('Cookie signature is not valid'));
    }

    // console.log('session ID ', sid);
    data.sid = sid;

    sessionStore.get(sid, function(err, session) {
      if (err) return next(err);
      if (! session) return next(new Error('session not found'));
      data.session = session;
      next();
    });
  } catch (err) {
    console.error(err.stack);
    next(new Error('Internal server error'));
  }
});

// routes
app.use('/', routes.index);
app.use('/api', routes.api);

// socket connections
io.on('connection', function(socket){
  var headers = socket.request.headers;
  var cookies = cookie.parse(headers.cookie);
  var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
  console.log('a user connected: ', sid);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', sid);

    // broadcast to other sockets about new connection
    socket.broadcast.emit('user disconnected', {sid: sid});

    // delete user from game
    request({
      url: 'http://localhost:8080/api/users/' + sid,
      method: 'DELETE'
    }, function(error, response, body){
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
      }
    });

  });
   
  // send down current session ID
  socket.emit('current user', {sid: sid});

  // broadcast to other sockets about new connection
  socket.broadcast.emit('new user', {sid: sid});
});

// starts server
http.listen(port, function(){
  console.log('listening on *:' + port);
});
