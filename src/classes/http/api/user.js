const express = require('express')
const router = express.Router()

module.exports = (middleware) => {
  if (middleware) router.use(middleware)
  return router
}
