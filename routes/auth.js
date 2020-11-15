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
    check('password', 'Password is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      let user = await UserSchema.findOne({ email })

      if (user) {
        return res.status(401).json({ msg: 'User already exists' })
      }

      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)

      user = UserSchema({
        email,
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
          res.json({ token })
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
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      let user = await UserSchema.findOne({ email })

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
          res.json({ token })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

module.exports = router