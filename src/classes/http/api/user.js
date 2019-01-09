const express = require('express')
const router = express.Router()
const TAG = 'api.user'

function addAfterMiddleware (router) {
  router.get('/', async (req, res) => {
    const user = res.locals.user
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email
    })
  })

  router.post('/', async (req, res) => {
    const user = res.locals.user

    if (!req.body.password_current) return res.status(403).json({
      error: 'missing password_current'
    })
    if (await user.login(req.body.password_current)) {
      user.username = req.body.username
      user.email = req.body.email
      if (req.body.password) await user.setPassword(req.body.password)

      await user.save()
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email
      })
    } else {
      return res.status(403).json({
        error: 'invalid credentials'
      })
    }
  })
}

module.exports = (middleware) => {
  if (middleware) router.use(middleware)
  addAfterMiddleware(router)
  return router
}
