const mongoose = require('mongoose')
const config = require('config')

const connectToDB = async () => {
  try {
    await mongoose.connect(
      config.get('mongoURI'), {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
    )
    console.log('Connected to DB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectToDB