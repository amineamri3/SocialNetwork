const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validateRegisterInput(data){
    let err = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.name = !isEmpty(data.name) ? data.name : '';

    // name validation
    if(! validator.isLength(data.name, {min:3, max:30})){
        err.name = 'Name must be between 3 and 30 characters';
    }
    if( isEmpty(data.name)){
        err.name = 'Name Field is mandatory';
    }

    //email validation
    if(! validator.isEmail(data.email)){
        err.email = 'Invalid Email address';
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

    if( !validator.equals(data.password,data.password2)){
        err.password2 = 'Passwords do not match';
    }
    if( isEmpty(data.password2)){
        err.password2 = 'Confirmation password Field is mandatory';
    }


return({
    errors: err,
    isValid: isEmpty(err)
});
}