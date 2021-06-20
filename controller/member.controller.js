var MemberService = require('../service/member/memver.service');

/**
 * 회원 전체 목록 Controller
 * @param {http-request} req 
 * @param {http-response} res 
 * @param {next} next 
 */
exports.getMembers = async (req, res, next) => {
    try {
        var members = await MemberService.getMembers();
        return res.status(200).json({status: 200, message: '', data: members});        
    } catch (e) {
        return res.status(500).json({status: 500, message: e.message });
    }
}

/**
 * 회원 아이디 존재 여부 확인
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.checkUserId = async (req, res, next) => {
    try {
        const { userId } = req.query;
        var check = await MemberService.getExistUser(userId);
        if (check) {
            return res.status(200).json({status:200, message: '존재하는 아이디 입니다.', data:check });
        } else {
            return res.status(200).json({status:200, message: '존재하지 않는 아이디 입니다.', data:check});
        }
    } catch (e) {
        return res.status(500).json({status: 500, message: e.message });
    }
}

/**
 * 회원 가입 Controller
 * @param {http-request}} req 
 * @param {http-response} res 
 * @param {next} next 
 * @returns 200 성공, 500 실패
 */
exports.addMember = async (req, res, next) => {
    try {
        var member = req.body;
        await MemberService.addMember(member);
        return res.status(200).json({status: 200, message: '회원 가입에 성공 하였습니다.'});
    } catch (e) {
        return res.status(500).json({status: 500, message: e.message});
    }
}

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
        console.log('authentication :', userId, password);
        var auth = await MemberService.authentication(userId, password);
        return res.status(200).json({status: 200, message: '인증 결과', authenication: auth});
    } catch (e) {
        return res.status(500).json({status: 500, message: e.message});
    }
}