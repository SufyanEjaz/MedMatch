const userService = require("../services/userService");
const authService = require("./../services/AuthService");
const {errorWithMessage, errorWithMessageBag} = require("../utils/response");
const routeConfig = require("./../config/routes");

module.exports = {

    /**
     * Auth validation middleware
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    validateToken: async (req, res, next) => {

        try {
            if(routeConfig.routes.non_auth.includes(req.path)) {
                return next();
            }

            //get token from request header
            const authHeader = req.headers["authorization"];
            if(!authHeader) {
                return errorWithMessage(res, "Token not presents", 400);
            }

            //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
            const token = authHeader.split(" ")[1];

            const authResponse = authService.validateToken(token);
            if (authResponse.status === false) {
                return errorWithMessage(res, authResponse.messages, 401);
            }

            // set auth
            await userService.setAuth(authResponse.data.user);

            next();

        } catch (error) {

            console.log(error);
            return errorWithMessageBag(res, error, 401);
        }
    }
}