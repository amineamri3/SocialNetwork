const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validateExperienceInput(data){
    let err = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    //title validation
    if(validator.isEmpty(data.title)){
        err.title = 'Title field is required';
    }
  

    
    // company
    if(! validator.isLength(data.company, {max:30})){
        err.company = 'Company field cannot exceed 30 characters';
    }
    if( isEmpty(data.company)){
        err.company = 'Company Field is mandatory';
    }


    // from /to /current
    if( isEmpty(data.from)){
        err.from = 'Starting date Field is mandatory';
    }

return({
    errors: err,
    isValid: isEmpty(err)
});
}