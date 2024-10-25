const {validationResult} = require("express-validator");

module.exports = {

    validateRequest: (request) => {
        try {
            const errors = validationResult(request);

            // if there is error then return Error
            if (!errors.isEmpty()) {
                return errors.array();
            }

            return [];

        } catch (error) {
            console.error('Error in validateRequest: ', error);
        }
    }
}