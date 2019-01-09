const express = require('express')
const router = express.Router()
const TAG = 'api.auth'

function addAfterMiddleware (router) {
  router.post('/', async (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).json({
      error: 'missing email or password'
    })
    let user = await User.where({ email: req.body.email.trim() })
    if (!user) return res.status(404).json({ error: 'user does not exist' })
    user = user[0]
    const valid = await user.login(req.body.password)
    if (!valid) {
      return res.status(403).json({ error: 'invalid credentials' })
    } else {

      const accessToken = new AccessToken({
        user_id: user.id
      })
      await accessToken.generate()
      const id = await accessToken.save()
      const refreshToken = new RefreshToken({
        user_id: user.id,
        access_token_id: id
      })
      await refreshToken.generate()
      await refreshToken.save()
      return res.status(200).json({
        access_token: accessToken.token,
        refresh_token: refreshToken.token
      })
    }
  })

  router.post('/email_exists', async (req, res) => {
    if (!req.body.email) return res.status(400).json({
      error: 'missing email'
    })
    const user = await User.where({ email: req.body.email.trim() })
    if (user) return res.status(200).json({ status: 'ok' })
    else return res.status(404).json({ error: 'not found' })
  })

  router.post('/email_available', async (req, res) => {
    if (!req.body.email) return res.status(400).json({
      error: 'missing email'
    })
    const user = await User.where({ email: req.body.email.trim() })
    if (!user) return res.status(200).json({ status: 'ok' })
    else return res.status(404).json({ error: 'not found' })
  })

  router.post('/register', async (req, res) => {
    if (!CFile.allow_signup) return res.status(401).json({})
    if (!req.body.email || !req.body.password) return res.status(400).json({
      error: 'missing email or password'
    })
    let user = await User.where({ email: req.body.email.trim() })
    if (user) return res.status(403).json({ error: 'already exists' })
    user = new User({
      email: req.body.email.trim(),
      username: req.body.email.trim()
    })
    await user.setPassword(req.body.password)
    await user.save()
    res.status(200).json({
      status: 'ok'
    })
  })
}

module.exports = (middleware) => {
  if (middleware) router.use(middleware)
  addAfterMiddleware(router)
  return router
}
