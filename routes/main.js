const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send({ title: 'You are on HOME page' })
  res.end()
})

module.exports = router;