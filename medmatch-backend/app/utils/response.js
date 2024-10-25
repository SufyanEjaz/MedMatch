module.exports = {

    /**
     * @param response
     * @param {string} error
     * @param {number} code
     * @returns {*}
     */
    apiNotFound: (response, error = '404 Not Found', code = 404) => {
        try {

            return response.status(code).json({
                status: false,
                errors: [{
                    "msg": error
                }],
            });

        } catch (error) {
            console.error('Error in apiNotFound: ', error);
        }
    },

    /**
     * @param response
     * @param {string} error
     * @param {number} code
     * @returns {*}
     */
    serverError: (response, error = 'Internal server error', code = 500) => {
        try {

            return response.status(code).json({
                status: false,
                errors: [{
                    "msg": error
                }],
            });

        } catch (error) {
            console.error('Error in serverError: ', error);
        }
    },

    /**
     * @param response
     * @param {array} errors
     * @param {number} code
     * @returns {*}
     */
    errorWithMessageBag: (response, errors, code = 400) => {
        try {

            return response.status(code).json({
                status: false,
                errors: errors,
            });

        } catch (error) {
            console.error('Error in errorWithMessageBag: ', error);
        }
    },

    /**
     * @param response
     * @param {string} error
     * @param {number} code
     * @returns {*}
     */
    errorWithMessage: (response, error, code = 400) => {
        try {

            return response.status(code).json({
                status: false,
                errors: [{
                    "msg": error
                }],
            });

        } catch (error) {
            console.error('Error in errorWithMessage: ', error);
        }
    },

    /**
     * @param response
     * @param {array} messages
     * @param {array|object} data
     * @param {number} code
     * @returns {*}
     */
    errorWithMessagesAndData: (response, messages, data, code = 400) => {
        try {

            return response.status(code).json({
                status: false,
                errors: messages,
                data: data
            });

        } catch (error) {
            console.error('Error in errorWithData: ', error);
        }
    },

    /**
     * @param response
     * @param {array} messages
     * @param {array|object} data
     * @param {number} code
     * @returns {*}
     */
    successWithData: (response, messages, data, code = 200, emailresponse = '') => {
        try {

            return response.status(code).json({
                status: true,
                messages: messages,
                data: data,
                email_response: emailresponse,
            });

        } catch (error) {
            console.error('Error in successWithData: ', error);
        }
    },

    /**
     * @param response
     * @param {string} message
     * @param {number} code
     * @returns {*}
     */
    successWithMessage: (response, message, code = 200) => {
        try {

            return response.status(code).json({
                status: true,
                messages: [
                    {
                        "msg": message
                    }
                ],
                data: [],
            });

        } catch (error) {
            console.error('Error in successWithMessage: ', error);
        }
    },

    directResponse: (response) => {
        try {

            return response;

        } catch (error) {
            console.error('Error in successWithMessage: ', error);
        }
    }

}