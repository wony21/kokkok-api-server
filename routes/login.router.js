var express = require('express');
var router = express.Router();
var passport = require('passport');

// 구글 로그인 구현
router.get('/google', passport.authenticate('google', {scope: ['profile']}));
// 네이버 로그인 구현
router.get('/naver', passport.authenticate('naver'));
// 카카오 로그인 구현
router.get('/kakao', passport.authenticate('kakao'));
// Facebook 로그인 구현
router.get('/facebook', passport.authenticate('facebook'));

// 로그아웃 처리
router.get('/logout', function (req, res) {
    req.logout();
    req
        .session
        .save(function () {
            res.redirect('/');
        });
});

// 로그인 성공 페이지
router.get('/success', async (req, res) => {
    var user = req.session.passport.user;
    console.log(user);
    if (user.id) {
        user['userId'] = user.id;
    }
    res.render('login/login-success', {user: user});
});

// 로그인 실패 페이지
router.get('/failed', async (req, res) => {
    // res.render('/login/login-failed');
    console.log('로그인 인증 실패');
    res.status(200).json({status: 401, message: '로그인 인증 실패', login: false});
});

// 로그인 처리 (passport 사용)
router.post(
    '/request',
    passport.authenticate('local', {failureRedirect: '/login/failed'}),
    (req, res) => {
        // 로그인 성공
        var userInfo = req.session.passport.user;
        console.log('passport login request is successed.');
        res.status(200).json({status: 200, message: '로그인 인증 성공', login: true, userInfo: userInfo});
    }
);

// 구글 Callback 구현
router.get('/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login/login-failed'}), 
    (req, res) => {
        console.log('-- google callback --');
        // 로그인이 되어 콜백이 되면 페이지로 전환
        res.redirect('/login/success');
    }
);
// 네이버 Callback 구현
router.get('/naver/callback', 
    passport.authenticate('naver', {failureRedirect: '/login/login-failed'}),
    (req, res) => {
        console.log('-- naver callback --');
        res.redirect('/login/success');
    }
);
// 카카오 Callback 구현
router.get('/kakao/callback', 
    passport.authenticate('kakao', {failureRedirect: '/login/login-failed'}),
    (req, res) => {
        console.log('-- kakao callback --');
        res.redirect('/login/success');
    }
);
// Facebook Callback 구현
router.get('/facebook/callback', 
    passport.authenticate('facebook', {failureRedirect: '/login/login-failed'}),
    (req, res) => {
        console.log('-- facebook callback --');
        res.redirect('/login/success');
    }
);

module.exports = router;
