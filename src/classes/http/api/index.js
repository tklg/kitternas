const express = require('express')
const router = express.Router()
const TAG = 'api'

const authEndpoint = require('./auth')
const userEndpoint = require('./user')

router.use('/auth', authEndpoint())
router.use('/user', userEndpoint(async (req, res, next) => {
  if (req.method.toLowerCase() === 'options') return next()
  const tokStr = req.header('authorization')
  if (!tokStr) return res.status(403).json({
    error: 'missing authorization header'
  })
  const token = await AccessToken.where({ token: tokStr.split(' ')[1] })
  if (!token) return res.status(403).json({
    error: 'access_denied',
    hint: 'invalid access token'
  })
  let user = await User.where({ id: token[0].user_id })
  if (user) {
    res.locals.user = user[0]
    return next()
  } else {
    return res.status(404).json({
      error: 'could not find user'
    })
  }
}))

module.exports = router
