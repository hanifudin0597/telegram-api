const express = require('express')
const { list, detail, update, updatePhoto, remove } = require('../controllers/user.controller')

const upload = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const route = express.Router()


route
    .get('/user', jwtAuth, list)
    .get('/user/:id', jwtAuth, detail)
    .put('/user/:id', jwtAuth, update)
    .put('/user/:id/photo', jwtAuth, upload, updatePhoto)
    .delete('/user/:id', jwtAuth, remove);


module.exports = route