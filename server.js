const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectToDB = require('./config/connection')

//configuration
dotenv.config()

const app = express()

//midleware
app.use(cors())
app.use(express.json({ extended: false }))

//db connection
connectToDB()

//routes
app.use('/', require('./routes/main'))
app.use('/api/users', require('./routes/auth'))
app.use('/api/priprema', require('./routes/priprema'))

const PORT = process.env.PORT || 3210

//running app
app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}`))