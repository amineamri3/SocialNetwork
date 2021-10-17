const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validatePostInput(data){
    let err = {};

    data.text = !isEmpty(data.text) ? data.text : '';


    //text validation
    if(! validator.isLength(data.text, {min:10, max:300})){
        err.text = 'Post must be between 10 and 300 characters';
    }

    
    if( isEmpty(data.text)){
        err.text = 'Post cannot be empty';
    }


return({
    errors: err,
    isValid: isEmpty(err)
});

}