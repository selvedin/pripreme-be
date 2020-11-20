const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const UserSchema = require('../models/User')
const auth = require('../middleware/auth')

router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      //select user by id and return all fields except password
      const user = await UserSchema.findById(req.user.id).select('-password')
      res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

router.post(
  '/register',
  [
    check('email', 'Email is not valid').isEmail(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let { firstname, lastname, email, phone, username, password } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      let userByUsername = await UserSchema.findOne({ username })
      let userByEmail = await UserSchema.findOne({ email })
      let userByPhone = await UserSchema.findOne({ phone })

      if (userByEmail) {
        return res.status(401).json({ msg: 'User with this email already registered!' })
      }
      if (userByPhone) {
        return res.status(401).json({ msg: 'User with this phone number already registered!' })
      }
      if (userByUsername) {
        return res.status(401).json({ msg: 'User with this username already registered!' })
      }

      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)

      user = UserSchema({
        firstname,
        lastname,
        email,
        phone,
        username,
        password
      })

      await user.save()

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        (err, token) => {
          if (err) {
            return res.status(500).json({ msg: 'Token generating error' })
          }
          res.json({ token, username })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      let { username, password } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      let user = await UserSchema.findOne({ username })

      if (!user) {
        return res.status(401).json({ msg: 'User is not registered' })
      }

      const isPasswordMatching = await bcrypt.compare(password, user.password)

      if (!isPasswordMatching) {
        return res.status(401).json({ msg: 'Password does not match' })
      }

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        (err, token) => {
          if (err) {
            return res.status(500).json({ msg: 'Token generating error' })
          }
          res.json({ token, username })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

module.exports = router