const express = require('express')
const helmet = require('helmet');
const bodyParser = require('body-parser')
const cors = require('cors')
const socketio = require('socket.io')
const http = require('http')
require('dotenv').config()
const authRoute = require('./src/routes/auth.route');
const userRoute = require('./src/routes/user.route');


const socketController = require('./src/socket')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.get('/ping', (req, res) => {
    res.json({
        message: "PONG"
    })
})
app.use(express.static('public'));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);
app.use(authRoute, userRoute);


const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: '*',
    }
})
io.on("connection", (socket) => {
    console.log('new user connected')
    socketController(io, socket)
})

const APP_PORT = process.env.PORT || 5009
server.listen(APP_PORT, () => {
    console.log(`service running on port ${APP_PORT}`)
})