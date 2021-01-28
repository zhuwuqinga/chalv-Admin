import {
    validateqq,
    // isvalidatemobile,
    validatephone,
    cardid,
    validateinteger,
    validatemoneynum,
    validatenull,
    isEmail,
    isMobile
} from './validate.js'

export default {
    /*qq号*/
    isQQ: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!validateqq(value)) {
                callback(new Error('您输入的QQ号不正确!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*邮箱*/
    isEmail: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!isEmail(value)) {
                callback(new Error('您输入的邮箱不正确!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*手机号*/
    isMobile: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!isMobile(value)) {
                callback(new Error('您输入的手机号不正确!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*座机号*/
    isPhone: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!validatephone(value)) {
                callback(new Error('您输入的座机号不正确!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*身份证号*/
    isCardID: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!cardid(value)) {
                callback(new Error('您输入的身份证号不正确!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*数字（正整数和0）*/
    isInteger: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!validateinteger(value)) {
                callback(new Error('请输入数字!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*保留两位小数*/
    isMoneynum: (rule, value, callback) => {
        if ((value || '') != '') {
            if (!validatemoneynum(value)) {
                callback(new Error('请输入正确的数字，最多保留两位小数!'))
            } else {
                callback()
            }
        } else {
            callback();
        }
    },
    /*验证是否为空*/
    isNull: (rule, value, callback) => {
        if (validatenull(value)) {
            callback(new Error('不能为空'))
        } else {
            callback()
        }
    }
}