var mongoose = require('mongoose');
var util = require('../../common/util');
var bcrypt = require('bcrypt');

const MemberSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        require: true,
        minlength: 5
    },
    email: {
        type: String,
        require: true,
        index : true
    },
    name: {
        type: String,
        require: true,
        index: true
    },
    sex: String,
    birth: String,
    phone: String,
    address1: String,
    address2: String,
    postNumber: String,
    memberFg: Number,
    createAt: Date,
    createUser: String,
    updateAt: Date,
    updateUser: String 
});

/* 트리거 */
MemberSchema.pre('save', function(next){
    var member = this;
    if (member.isModified()) {
        console.log('modified member');
        member.password = util.hash_password(member.password);
        next();
    } else {
        next();
    }
});

/* 메소드 */
/** 인증하기 */
MemberSchema.methods.comparePassword = function(painPassword) {
    var member = this;
    return bcrypt.compareSync(painPassword, member.password);
}

/* 인덱스 처리 */
MemberSchema.index({ userId: 'text' });
MemberSchema.index({ email: 'text' });
MemberSchema.index({ name: 'text' });

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
