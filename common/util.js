var bcrypt = require('bcrypt');

/**
 * 비밀번호 암호화 (미들웨어 미동작으로 Util로 우선 생성)
 * @param {비밀번호} password 
 */
exports.hash_password = async (password) => {
    var salt = bcrypt.genSaltSync(10);
    console.log('salt :', salt);
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    return hash;
}

exports.comparePassword = async (painPassword, encryptPassword) => {
    var hash_password = this.hash_password(painPassword);
    console.log('hash_password :', hash_password);
    console.log('encrypt_password :', encryptPassword);
    return bcrypt.compareSync(painPassword, encryptPassword);
}