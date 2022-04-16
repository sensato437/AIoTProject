const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');


router.get('/',                     ctrl.get_index)
//아파트관련
router.get('/apart/list',           ctrl.get_apart_list );
router.get('/apart/register',       ctrl.get_apart_register);
router.get('/apart/batchregister',  ctrl.get_apart_batchregister);
router.post('/apart/batchregister',  ctrl.post_apart_batchregister);
router.post('/apart/register',      ctrl.post_apart_register );
router.post('/apart/modify',        ctrl.post_apart_modify );
router.post('/apart/delete',        ctrl.post_apart_delete );
router.post('/apart/deletes',        ctrl.post_apart_deletes );
router.post('/apart/modify/put',    ctrl.put_apart_modify );
//어드인
router.get('/list',                 ctrl.get_list );
router.get('/register',             ctrl.get_register );
router.get('/modify',               ctrl.get_modify );
//거주자
router.get('/resident/list',        ctrl.get_resident_list);
router.get('/resident/register',    ctrl.get_resident_register);
router.post('/resident/modify',     ctrl.get_resident_modify);
router.post('/resident/register',   ctrl.post_resident_register);
router.get('/resident/info',        ctrl.get_resident_info);
router.post('/resident/delete',     ctrl.post_resident_delete);
router.post('/resident/deletes',    ctrl.post_resident_deletes);
router.post('/resident/modify/put', ctrl.put_residen_modify)
//방문자
router.get('/visit/list',           ctrl.get_visit_list);
router.get('/visit/register',       ctrl.get_visit_register);
router.post('/visit/register',      ctrl.post_visit_register);
router.post('/visit/modify',        ctrl.get_visit_modify);
router.post('/visit/modify/put',    ctrl.put_visit_modify);
router.post('/visit/delete',        ctrl.post_visit_delete);
router.post('/visit/deletes',       ctrl.post_visit_deletes);
router.post('/visit/acc',           ctrl.post_visit_acc);
router.post('/visit/refuse',        ctrl.post_visit_refuse);

router.get('/login',                ctrl.get_login);
router.post('/simpleres',           ctrl.get_res_simple);
router.post('/simpleres/all',       ctrl.get_res_simple_all);
router.post('/simpleres/wait',      ctrl.get_res_simple_wait);
module.exports = router;