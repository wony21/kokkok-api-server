var Member = require('../../model/member/member.model');
var Common = require('../../common/define.data');
var Util = require('../../common/util');

/**
 * 사용자 목록 조회
 * @returns 사용자 전체 목록
 */
exports.getMembers = async () => {
    try {
        var members = await Member.find();
        return members;
    } catch (e) {
        throw Error(e.message);
    }
}

/**
 * 회원 인증 - 기본
 * @param {회원 아이디}} userId 
 * @param {비밀번호} password 
 * @returns 
 */
 exports.authentication = async (userId, password) => {
    try {
        var whereFilter = `this.userId.toUpperCase() == '${userId.toUpperCase()}'`;
        var member = await Member.findOne({ $where : whereFilter });
        if (member) {
            return member.comparePassword(password);
        } else {
            throw Error('존재하지 않은 회원 입니다.');
        }
    } catch (e) {
        throw Error(e.message);
    }
}

/**
 * 회원 아이디 존재 여부 확인
 * @param {회원가입 아이디} userId 
 * @returns 
 */
exports.getExistUser = async(userId) => {
    try {
        // 사용자 존재 여부 
        var whereFilter = `this.userId.toUpperCase() == '${userId.toUpperCase()}'`;
        var member = await Member.findOne({ $where : whereFilter });
        if (member) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        throw Error(e.message);
    }
}

/**
 * 회원 아이디로 회원 정보 찾기
 * @param {회원 아이디} userId 
 * @returns 
 */
exports.getUserFromId = async(userId) => {
    try {
        var whereFilter = `this.userId.toUpperCase() == '${userId.toUpperCase()}'`;
        var member = await Member.findOne({ $where : whereFilter });
        return member;
    } catch (e) {
        throw Error(e.message);
    }

}

/**
 * 회원 추가
 * @param {회원가입정보} member 
 * @returns 
 */
 exports.addMember = async (member) => {
    try {
        // 변수 바인딩
        const { 
            userId, password, email, name, sex, birth, phone, address1, address2, postNumber 
        } = member;
        // 입력값 검사
        if (!userId) {
            throw Error('사용자 아이디를 입력 하세요.');
        }
        if (!password) {
            throw Error('비밀번호를 입력 하세요.');
        }
        if (!name) {
            throw Error('이름을 입력 하세요.');
        }
        if (!email) {
            throw Error('Email을 입력 하세요.');
        }
        // 대문자 변환
        var UpperUserId = userId.toUpperCase();
        // 예약어 검사
        if ( UpperUserId.indexOf('ADMIN') > 0 || 
             UpperUserId.indexOf('ROOT') > 0 || 
             UpperUserId.indexOf('SUPER') > 0 ) {
            throw Error('다음 문자가 들어가는 아이디는 사용 할 수 없습니다. (ADMIN, ROOT, SUPER) ');
        }
        // 정규식 아이디 Rule 검사
        var idRegex = /^[A-za-z]{5,15}/g;
        if (!idRegex.test(userId)) {
            throw Error('아이디는 대소문자로 시작하고 5~15자 사이로 입력 해야 합니다.');
        }
        // 존재하는 아이디 확인
        var exist = await this.getExistUser(userId);
        if (exist) {
            throw Error('사용 중인 아이디 이므로 사용 할 수 없습니다.');
        }
        // Member Object 생성
        const newMember = new Member({
            userId: userId,
            password: password,
            email: email,
            name: name,
            sex: sex,
            birth: birth,
            phone: phone,
            address1: address1,
            address2: address2,
            postNumber: postNumber,
            memberFg: '1',
            createAt: new Date(),
            createUser: 'system',
            updateAt: new Date(),
            updateUser: 'system'
        });
        // DB 저장
        newMember.save();
        // 신규 Member Object 반환
        return newMember;

    } catch (e) {
        throw Error(e.message);
    }
}

/**
 * 회원 정보 수정 하기
 * @param {수정할 회원} member 
 * @returns 
 */
exports.updateMember = async (member) => {
    try {
        // 변수 바인딩
        const { 
            userId, password, email, name, sex, birth, phone, address1, address2, postNumber, memberFg
        } = member;
        // 입력값 검사
        if (!userId) {
            throw Error('사용자 아이디를 입력 하세요.');
        }
        if (!password) {
            throw Error('비밀번호를 입력 하세요.');
        }
        if (!name) {
            throw Error('이름을 입력 하세요.');
        }
        if (!email) {
            throw Error('Email을 입력 하세요.');
        }
        // 존재하는 아이디 확인
        var exist = await this.getExistUser(userId);
        if (exist) {
            throw Error('사용 중인 아이디 이므로 사용 할 수 없습니다.');
        }

        await Member.findOneAndUpdate(
            { $where : `this.userId.toUpperCase() == '${userId.toUpperCase()}'`},
            { 
                password: password,
                email: email,
                name: name,
                sex: sex,
                birth: birth,
                phone: phone,
                address1: address1,
                address2: address2,
                postNumber: postNumber,
                memberFg: memberFg,
                updateAt: new Date(),
                updateUser: null
            }
        );
        // 신규 Member Object 반환
        return newMember;

    } catch (e) {
        throw Error(e.message);
    }
}