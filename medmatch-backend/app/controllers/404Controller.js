const {apiNotFound, serverError} = require("../utils/response");

module.exports = {

    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    notFound: async (req, res, next) => {
        try {
            return apiNotFound(res);

        } catch (error) {
            console.error('Error: ', error);
            return serverError(res);
        }
    }
};
