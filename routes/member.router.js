var express = require('express');
var router = express.Router();
var MemberController = require('../controller/member.controller');

/**
 * 회원 목록 조회 Router
 */
router.get('/list', MemberController.getMembers);
/**
 * 회원 가입 Router
 */
router.put('/add', MemberController.addMember);
/**
 * 회원 인증 (기본인증)
 */
router.post('/authentication', MemberController.authentication);

module.exports = router;
