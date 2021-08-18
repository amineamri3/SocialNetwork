const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validateEducationInput(data){
    let err = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.field = !isEmpty(data.field) ? data.field : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    //school validation
    if(validator.isEmpty(data.school)){
        err.school = 'School field is required';
    }
  

    
    // degree
    if( isEmpty(data.degree)){
        err.degree = 'Degree field is required';
    }

    // field 
    if( isEmpty(data.field)){
        err.field = 'Field field is required';
    }

    // from 
    if( isEmpty(data.from)){
        err.from = 'Starting date Field is required';
    }

return({
    errors: err,
    isValid: isEmpty(err)
});
}