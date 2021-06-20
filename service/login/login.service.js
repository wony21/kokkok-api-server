var Member = require('../../model/member/member.model');


/**
 * 로그인 (기본)
 * @param {회원 아이디} userId 
 * @param {회원 비밀번호} password 
 * @returns 
 */
exports.login = async (userId, password) => {
    try {
        var member = await Member.findOne({ $where: `this.userId.toUpperCase() == '${userId.toUpperCase()}'` });
        if (member) {
            var auth = await member.comparePassword(password); 
            if (auth) {
                console.log('-- login service --');
                console.log(member);
                return member;
            } else {
                return null;
            }
        } else {
            throw Error('존재하지 않은 회원 입니다.');
        }
    } catch (e) {
        throw Error(e.message);
    }
}

