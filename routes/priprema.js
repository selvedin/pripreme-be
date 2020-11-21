const express = require('express')
const ProtectedRoutes = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const PripremaSchema = require('../models/Priprema')
const UserSchema = require('../models/User')


ProtectedRoutes.use((req, res, next) => {

  // check header for the token
  var token = req.headers['x-auth-token'];

  // decode token
  if (token) {

    // verifies secret and checks if the token is expired
    jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'You have to be authenticated' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token  

    res.status(401).send({ msg: 'You have no permission to access this link' });

  }
});

ProtectedRoutes.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const user = await UserSchema.findById(req.user.id).select('firstname lastname')
      const pripreme = await PripremaSchema.find({ nastavnik: user.firstname + ' ' + user.lastname })
      res.json(pripreme)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

ProtectedRoutes.delete(
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
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

ProtectedRoutes.get(
  '/view',
  auth,
  async (req, res) => {
    try {
      const { id } = req.query
      const priprema = await PripremaSchema.findById({ _id: id })
      res.json(priprema)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

ProtectedRoutes.post(
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
            console.log('no update')
          }
          else {
            res.send(result)
          }
        })
      }

      //remove empty id
      delete loadedData._id

      let priprema = PripremaSchema({ ...loadedData, nastavnik_id: req.user.id })

      let existingPriprema = await PripremaSchema.findOne({ skolskaGodina, nastavnik, razred, predmet })
      if (existingPriprema) {
        return res.status(401).json({ msg: 'Priprema za ovu skolsku godinu iz ovog predmeta za ovaj razred vec postoji u bazi.' })
      }

      await priprema.save()

      res.json({ priprema })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: 'Server error ...' })
    }
  }
)

module.exports = ProtectedRoutes