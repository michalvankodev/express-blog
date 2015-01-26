'use strict';

var express = require('express');
var controller = require('./comment.controller');
var router = express.Router();

router.post('/:id',  controller.create);

module.exports = router;
