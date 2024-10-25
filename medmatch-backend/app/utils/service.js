module.exports = {

    /**
     * @param {boolean} status
     * @param {array|object|string|number} data
     * @param {array} messages
     * @param {number} statusCode
     * @returns {{status, data}}
     */
    serviceResponse: (status, data, messages = [], statusCode = 200) => {
        try {
            return {
                status: status,
                messages: messages,
                data: data,
                status_code: statusCode
            };

        } catch (error) {
            console.error('Error in serviceResponse: ', error);
        }
    },

}