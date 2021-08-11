const validator = require('validator');
function isEmpty(x){
    return(
        x === undefined ||
        x === null ||
        (typeof x === 'object' && Object.keys(x).length === 0) ||
        (typeof x === 'string' && x.trim().length === 0)
    );
}
module.exports = function validateProfileInput(data){
    let err = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.status = !isEmpty(data.status) ? data.status : '';


    //handle validation
    if(! validator.isLength(data.handle,{min:3,max:40})){
        err.handle = 'handle needs to be between 3 and 40 characters';
    }

    if( isEmpty(data.handle)){
        err.handle = 'handle is required';
    }

    // status
    if( isEmpty(data.status)){
        err.status = 'status Field is mandatory';
    }

    // skills
    if( isEmpty(data.skills)){
            err.skills = 'skills Field is mandatory';
    }

    // Links
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website))
          err.website = 'Not a valid URL'
    }
    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook))
          err.facebook = 'Not a valid URL'
    }
    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin))
          err.linkedin = 'Not a valid URL'
    }
    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter))
          err.twitter = 'Not a valid URL'
    }
    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram))
          err.instagram = 'Not a valid URL'
    }


return({
    errors: err,
    isValid: isEmpty(err)
});
}