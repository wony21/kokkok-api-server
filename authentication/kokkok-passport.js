const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LoginService = require('../service/login/login.service');

module.exports = () => {

    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        console.log(user);
        done(null, user);
    });
    
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser');
        done(null, user);
    });
    // Local 인증 구현
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
    }, async (username, password, done) => {
            try {
                console.log(`request passport authentication ${username}, ${password}`);
                var member = await LoginService.login(username, password);
                if (member) {
                    return done(null, member);
                } else {
                    return done(null, false, {message: '아이디가 존재하지 않거나 사용자 인증에 실패 하였습니다.'})
                }
            } catch (e) {
                return done(null, false, {message: e.message});
            }
        }
    ));
    // Google 인증 구현
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done){
        const {
            _json: {id, avatar_url, login: name, email}
        } = profile;
        try {
            console.log('-- google login --');
            console.log(profile);
            console.log(`accessToken: ${accessToken}`);
            return done(null, profile);
        } catch (e) {
            return done(e);
        }
    }));
    // 네이버 인증 구현
    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: process.env.NAVER_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done){
        try {
            console.log(profile);
            console.log(`naver accessToken: ${accessToken}`);
            return done(null, profile);
        } catch (e) {
            return done(e);   
        }
    }));
    // 카카오 인증 구현
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_RESTAPI_KEY,
        callbackURL: process.env.KAKAO_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done){
        try {
            console.log(profile);
            console.log(`kakao accessToken: ${accessToken}`);
            return done(null, profile);
        } catch (e) {
            return done(e);   
        }
    }));
    // 페이스북 인증 구현
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done){
        const {
            _json: {id, avatar_url, login: name, email}
        } = profile;
        try {
            console.log('-- facebook login --');
            console.log(profile);
            console.log(`accessToken: ${accessToken}`);
            return done(null, profile);
        } catch (e) {
            return done(e);
        }
    }));
}

