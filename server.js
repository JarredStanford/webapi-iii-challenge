const express = require('express');
const helmet = require('helmet')

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path} @ ${Date.now()}`)

  next();
};


server.use(logger);
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the User Database' })
});

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

module.exports = server;
