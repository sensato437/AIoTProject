const { Router } = require('express');
const router = Router();
const ctrl = require('./resident.ctrl');

router.get('/list',         ctrl.get_list );
router.get('/info',         ctrl.get_info );
router.get('/register',     ctrl.get_register );
router.get('/modify',       ctrl.get_modify );

router.get('/login',        ctrl.get_login);

module.exports = router;