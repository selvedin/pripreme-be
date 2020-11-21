const mongoose = require('mongoose')

let PripremaSchema = mongoose.Schema({
  skolskaGodina: {
    type: String,
    maxlength: 20,
    required: true
  },
  nastavnik: {
    type: String,
    required: true,
    maxlength: 256
  },
  nastavnik_id: {
    type: String,
    required: true
  },
  razred: {
    type: String,
    maxlength: 20,
    required: true
  },
  predmet: {
    type: String,
    maxlength: 128,
    required: true
  },
  datum: {
    type: String,
    maxlength: 20
  },
  nastavnaOblast: {
    type: String,
    maxlength: 20
  },
  nastavnaJedinica: {
    type: String,
    maxlength: 20
  },
  ciljeviOdgojni: {
    type: String
  },
  ciljeviObrazovni: {
    type: String
  },
  ciljeviFunkcionalni: {
    type: String
  },
  ciljeviDuhovni: {
    type: String
  },
  strukturaCasa: {
    type: String
  },
  tipCasa: {
    type: String
  },
  obliciNastavnogRada: {
    type: String
  },
  nastavniObjekti: {
    type: String
  },
  nastavniPomagala: {
    type: String
  },
  korelacija: {
    type: String
  },
  lokacija: {
    type: String
  },
  planTable: {
    type: String
  },
  literatura: {
    type: String
  },
  nastavneMetode: {
    type: String
  },
  uvodniTrajanje: {
    type: String,
    maxlength: 10
  },
  uvodniSadrzaj: {
    type: String
  },
  glavniTrajanje: {
    type: String,
    maxlength: 10
  },
  glavniSadrzaj: {
    type: String
  },
  zavrsniTrajanje: {
    type: String,
    maxlength: 10
  },
  zavrsniSadrzaj: {
    type: String
  },
  domaciRad: {
    type: String
  }


})

module.exports = PripremaSchema = mongoose.model('priprema', PripremaSchema)