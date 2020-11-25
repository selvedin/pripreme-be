const PripremaRoute = require('./ProtectedRoute')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const PripremaSchema = require('../models/Priprema')
const UserSchema = require('../models/User')


PripremaRoute.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const user = await UserSchema.findById(req.user.id).select('firstname lastname')
      const pripreme = await PripremaSchema.find({ nastavnik: user.firstname + ' ' + user.lastname })
      res.json(pripreme)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Greška na serveru ...' })
    }
  }
)

PripremaRoute.delete(
  '/',
  auth,
  async (req, res) => {
    try {
      const { _id } = req.body
      await PripremaSchema.findOneAndDelete({ _id });
      const pripreme = await PripremaSchema.find()
      res.json(pripreme)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Greška na serveru ...' })
    }
  }
)

PripremaRoute.get(
  '/view',
  auth,
  async (req, res) => {
    try {
      const { id } = req.query
      const priprema = await PripremaSchema.findById({ _id: id })
      res.json(priprema)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Greška na serveru ...' })
    }
  }
)

PripremaRoute.post(
  '/save',
  [
    check('skolskaGodina', 'Polje Skolska godina je obavezno').not().isEmpty(),
    check('razred', 'Polje Razred je obavezno').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      let loadedData = {
        skolskaGodina,
        nastavnik,
        razred,
        predmet,
        datum,
        nastavnaOblast,
        nastavnaJedinica,
        ciljeviOdgojni,
        ciljeviObrazovni,
        ciljeviFunkcionalni,
        ciljeviDuhovni,
        strukturaCasa,
        tipCasa,
        obliciNastavnogRada,
        nastavniObjekti,
        nastavniPomagala,
        korelacija,
        lokacija,
        planTable,
        literatura,
        nastavneMetode,
        uvodniTrajanje,
        uvodniSadrzaj,
        glavniTrajanje,
        glavniSadrzaj,
        zavrsniTrajanje,
        zavrsniSadrzaj,
        korekcija,
        domaciRad
      } = req.body

      let { _id } = req.body

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      if (_id) {
        PripremaSchema.findByIdAndUpdate({ _id }, { ...loadedData, nastavnik_id: req.user.id }, (err, result) => {
          if (err) {
            res.status(500).json({ msg: 'Greška prilikom snimanje pripreme', error: err.message })
          }
          else {
            res.send(result)
          }
        })
      }
      else {
        //remove empty id
        delete loadedData._id

        let priprema = PripremaSchema({ ...loadedData, nastavnik_id: req.user.id })

        let existingPriprema = await PripremaSchema.findOne({ skolskaGodina, nastavnik, razred, predmet })
        if (existingPriprema) {
          return res.status(401).json({ msg: 'Priprema za ovu skolsku godinu iz ovog predmeta za ovaj razred vec postoji u bazi.' })
        }

        await priprema.save()

        res.json({ priprema })
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Greška na serveru ...' })
    }
  }
)

module.exports = PripremaRoute