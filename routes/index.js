let express = require('express');
let router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Store', product: api.js/product });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
})

module.exports = router;
