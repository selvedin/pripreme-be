const express = require('express')
const dotenv = require('dotenv')
const connectToDB = require('./config/connection')

dotenv.config()

const app = express()

app.use(express.json({ extended: false }))

connectToDB()

app.use('/', require('./routes/main'))
app.use('/api/users', require('./routes/auth'))

const PORT = process.env.PORT || 3210

app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}`))