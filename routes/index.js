let express = require('express');
let router = express.Router();
const Product = require('../models').Product;


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Store',
    products: [Product
      .findAll()
      .then((products) => res.status(200).send(products))
      .catch((error) => { res.status(400).send(error); })]
  });
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.get('/productAll', function (req,  next){
  res.render('prod_table.ejs');
});

router.get('/login', function (req, res, next) {
  res.render('login');
})

module.exports = router;
