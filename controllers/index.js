const { Router } = require('express');
const router = Router()

router.use('/admin', require('./admin'));
router.use('/resident', require('./resident'));
router.use('/visit', require('./visit'));

module.exports = router;