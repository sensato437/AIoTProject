const { Router } = require('express');
const router = Router();
const ctrl = require('./visit.ctrl');

//게스트
router.get('/guest/lookup', ctrl.get_guest_lookup );
router.get('/guest/modify', ctrl.get_guest_modify);
router.get('/guest/reservation',ctrl.get_guest_reservation);

//유저
router.get('/user/info',ctrl.get_user_info);
router.get('/user/info_modify',ctrl.get_user_info_modify);
router.get('/user/list',ctrl.get_user_list);
router.get('/user/reservation',ctrl.get_user_reservation);
router.get('/user/res_modify',ctrl.get_user_res_modify);

router.get('/login',ctrl.get_login);

module.exports = router;