var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "hikmet",
  port: "3308",
  password: "",
  database: "crudtest",
  debug: false
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


con.connect(function(err) {
  // The server is either down
  // or restarting
  if(err) {
      // We introduce a delay before attempting to reconnect,
      // to avoid a hot loop, and to allow our node script to
      // process asynchronous requests in the meantime.
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
  }
  else
  {
    console.log('connection success');
  }
});

router.get('/select', function(req, res, next){
  con.query('SELECT * FROM users', function(error, rs){
    console.log(error, rs);
    res.render('select', {user: rs});
  });
});


router.get('/form', function (req, res, next){
  res.render('form', {user: {}});
});

router.post('/form', function (req, res, next){
  con.query('INSERT INTO users SET ?',req.body ,function (err, rs){
    res.redirect('/select');
    console.log(err, rs);
  });
});

router.get('/delete', function (req, res, next){
  con.query('DELETE FROM users WHERE id = ?', req.query.id, function(err, rs){
    res.redirect('/select');
    console.log('id =',req.query.id,' Delete success');
  });
});

router.get('/update', function (req, res, next){
    con.query('SELECT * FROM users WHERE id = ?', req.query.id, function(err, rs){
      res.render('form', {user : rs[0]});
      console.log(rs);
    });
});

router.post('/update', function (req, res, next){
  var param=
  [
    req.body,
    req.query.id
  ]
  con.query('UPDATE users SET ? WHERE id=? ', param, function(err, rs){
    console.log('id =',req.query.id,' users update success');
    res.redirect('/select');
  });
});




module.exports = router;

