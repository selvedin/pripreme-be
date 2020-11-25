const ExportsRoute = require('./ProtectedRoute')
const auth = require('../middleware/auth')
const pdf = require("pdf-creator-node")
const fs = require('fs')
const path = require('path')

// Read HTML Template
const html = fs.readFileSync(path.resolve(__dirname, "../templates/html/pdf.html"), 'utf8')

const options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
  },
  "footer": {
    "height": "28mm",
    "contents": {
      first: 'Cover page',
      2: 'Second page', // Any page number is working. 1-based index
      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: 'Last Page'
    }
  }
}

const users = [
  {
    name: "Shyam",
    age: "26"
  },
  {
    name: "Navjot",
    age: "26"
  },
  {
    name: "Vitthal",
    age: "26"
  }
]

ExportsRoute.get(
  '/pdf',
  auth,
  async (req, res) => {
    try {
      const { name, id } = req.query
      const document = {
        html: html,
        data: {
          users: users
        },
        path: path.resolve(__dirname, "../outputs/pdfs/export.pdf")
      }

      let fileName = ''
      await pdf.create(document, options)
        .then(response => {
          fileName = response.filename
        })
        .catch(error => {
          return res.status(500).json({ msg: 'Greška na serveru ...', error: error.message })
        })
      if (fileName !== '')
        res.download(fileName)
      else
        res.json({ msg: 'There is no file to download' })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Greška na serveru ...', error: error.message })
    }
  }
)

module.exports = ExportsRoute