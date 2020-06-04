const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const Product = require('../models').Product;
const User = require('../models').User;

router.post('/signup', function(req, res) {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    res.status(400).send({msg: 'Please pass username and password.'})
  } else {
    User
      .create({
        username: req.body.username,
        password: req.body.password
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
});

router.post('/signin', function(req, res) {
  User
      .find({
        where: {
          username: req.body.username
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'Authentication failed. User not found.',
          });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err) {
            let token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
              console.log(token);
            })
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        })
      })
      .catch((error) => res.status(400).send(error));
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
})

router.get('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    Product
      .findAll()
      .then((products) => res.status(200).send(products))
      .catch((error) => { res.status(400).send(error); });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/product_sort', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token){
    Product
        .findAll({order: [
            ['prod_name', 'prod_desc', 'prod_price']
          ]})
        .then((products) => res.status(200).send(products))
        .catch((error) => { res.status(400).send(error); });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/product_filter', passport.authenticate('jwt', {session:false}), function (req, res) {
  let token = getToken(req.headers);
  if (token){
    Product
        .findAll({where: prod_price in (150)})
        .then((products) => res.status(200).send(products))
        .catch((error) => { res.status(400).send(error); });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    Product
      .create({
        prod_name: req.body.prod_name,
        prod_desc: req.body.prod_desc,
        prod_price: req.body.prod_price
      })
      .then((product) => res.status(201).send(product))
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
