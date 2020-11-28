const ExportsRoute = require('./ProtectedRoute')
const auth = require('../middleware/auth')
const pdf = require("pdf-creator-node")
const fs = require('fs')
const path = require('path')
const PripremaSchema = require('../models/Priprema')
const { findOne } = require('../models/Priprema')

// Read HTML Template
const html = fs.readFileSync(path.resolve(__dirname, "../templates/html/pdf.html"), 'utf8')

const options = {
  format: "A4",
  orientation: "portrait",
  border: "5mm",
  header: {
    height: "15mm",
    contents: '<div>Priprema</div>'
  },
  "footer": {
    "height": "10mm",
    "contents": {
      first: '',
      2: 'Second page', // Any page number is working. 1-based index
      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: ''
    }
  }
}


ExportsRoute.get(
  '/pdf',
  auth,
  async (req, res) => {
    try {
      const { name, id } = req.query
      const priprema = await PripremaSchema.findOne({ _id: id })
      const document = {
        html: html,
        data: {
          title: name,
          priprema: mapPriprema(priprema),
        },
        path: path.resolve(__dirname, "../outputs/pdfs/" + name + ".pdf")
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

const mapPriprema = (priprema) => {
  let predmet = []
  for (let pr in priprema) {
    predmet[pr] = priprema[pr]
  }
  return predmet
}

module.exports = ExportsRoute