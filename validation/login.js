const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validateLoginInput(data){
    let err = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    //email validation
    if(! validator.isEmail(data.email)){
        err.email = 'Invalid Email address';
    }
    if(! validator.isEmail(data.email)){
        err.email = 'Invalid email address';
    }
    if( isEmpty(data.email)){
        err.email = 'Email Field is mandatory';
    }
    // password
    if(! validator.isLength(data.password, {min:6})){
        err.password = 'Password must be at least 6 characters';
    }
    if( isEmpty(data.password)){
        err.password = 'Password Field is mandatory';
    }


return({
    errors: err,
    isValid: isEmpty(err)
});
}