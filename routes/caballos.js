const express = require('express');
const {
  getCaballos

} = require('../controllers/caballos');

const router = express.Router({ mergeParams: true });


router.route('/caballos/:id').get(getCaballos)
router.route('/pedigree/:id').get(getCaballos)

module.exports = router;
