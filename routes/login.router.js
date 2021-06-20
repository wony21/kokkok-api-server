var express = require('express');
var router = express.Router();
var passport = require('passport');

// 구글 로그인 구현
router.get('/google', passport.authenticate('google', { scope: ['profile']}));

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
    res.render('/login/login-failed');
});

// 로그인 처리 (passport 사용)
router.post(
    '/request',
    passport.authenticate('local', {failureRedirect: '/login/failed'}),
    (req, res) => {
        // 로그인 성공
        var userInfo = req.session.passport.user;
        const {userid, username} = userInfo;
        console.log(`login success `);
        console.log(userInfo);
        res.redirect('/login/success');
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

module.exports = router;
