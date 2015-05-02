'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);  // This can be a seoTitle as well
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

// Comments
router.post('/:id/comment', controller.addComment); // :id can be a seoTitle as well
router.delete('/:id/comment/:commentId', auth.hasRole('admin'), controller.destroyComment);
router.put('/:id/comment/:commentId', auth.hasRole('admin'), controller.editComment);
router.patch('/:id/comment/:commentId', auth.hasRole('admin'), controller.editComment);

module.exports = router;
