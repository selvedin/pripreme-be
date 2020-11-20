const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const PripremaSchema = require('../models/Priprema')

router.get(
  '/',
  async (req, res) => {
    try {
      const pripreme = await PripremaSchema.find()
      res.json(pripreme)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

router.post(
  '/save',
  [
    check('skolskaGodina', 'Polje Skolska godina je obavezno').not().isEmpty(),
    check('razred', 'Polje Razred je obavezno').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let {
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
        domaciRad
      } = req.body
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      let existingPriprema = await PripremaSchema.findOne({ skolskaGodina, nastavnik, razred, predmet })

      if (existingPriprema) {
        return res.status(401).json({ msg: 'Priprema za ovu skolsku godinu iz ovog predmeta za ovaj razred vec postoji u bazi.' })
      }

      priprema = PripremaSchema({
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
        domaciRad
      })

      await priprema.save()

      res.json({ priprema })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

module.exports = router