'use strict';

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;
    try {
        let fieldName = error.message.substring(error.message.lastIndexOf('.$') + 2, error.message.lastIndexOf('_1'));
        console.log('fieldName.charAt(0).toUpperCase()',fieldName.charAt(0).toUpperCase());
        if(fieldName=='slug'){
            output = 'Title exists. Please rename your title.'
        } else {
            output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';            
        }
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * Get the error message from error object
 */
exports.errorHandler = error => {
    let message = '';

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                console.log('error in errorHandler helper: ',error)
                message = 'Something went wrong';
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message) message = error.errorors[errorName].message;
        }
    }

    return message;
};
