var express = require('express');
var router = express.Router();
var Promise = require('sequelize').Promise
var Place = require('../models/place');
var Hotel = require('../models/hotel');
var Restaurant = require('../models/restaurant');
var Activity = require('../models/activity');


router.get('/', function(req, res, next) {
  Promise.all([
    Hotel.findAll({
      include: [{
        model: Place
      }]
    }),
    Restaurant.findAll({
      include: [{
        model: Place
      }]
    }),
    Activity.findAll({
      include: [{
        model: Place
      }]
    })
  ])
  .spread(function (hotels, restaurants, activities) {
    res.render('index', {
      templateHotels: hotels,
      templateRestaurants: restaurants,
      templateActivities: activities
    })
  })
  .catch(next)
});

module.exports = router;
