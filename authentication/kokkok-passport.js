const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
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

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'http://localhost:25021/login/google/callback'
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
}

