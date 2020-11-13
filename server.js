const express = require('express')
const app = express()

const PORT = process.env.PORT || 3210

app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}`))