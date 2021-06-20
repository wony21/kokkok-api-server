const LoginService = require('../service/login/login.service');

/**
 * 회원 인증
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.authentication = async (req, res, next) => {
    try {
        const { userId, password } = req.body;
        var member = await LoginService.login(userId, password);
        if (member) {
            res.render('login/login-success', { user: member });
        } else {
            res.render('login/login-failed', {});   
        }
    } catch (e) {
        res.render('login/login-failed');
    }
}