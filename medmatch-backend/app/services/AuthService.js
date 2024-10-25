const {serviceResponse} = require("../utils/service");
const {
    access_token_secret,
    access_token_expiry,
    refresh_token_secret,
    refresh_token_expiry,
    password_salt
} = require("../config/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Service = require('./Service')

/**
 * Generate access token
 *
 * @param user
 * @returns {*}
 */
function generateAccessToken(user) {
    try {

        return jwt.sign(user, access_token_secret, {expiresIn: access_token_expiry})

    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Generate refresh token
 *
 * @param user
 * @returns {*}
 */
function generateRefreshToken(user) {
    try {

        return jwt.sign(user, refresh_token_secret, {expiresIn: refresh_token_expiry})

    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Verify password
 *
 * @param passwordFromRequest
 * @param hashedPassword
 * @returns {Promise<boolean>}
 */
async function verifyPassword(passwordFromRequest, hashedPassword) {

    try {
        if (await bcrypt.compare(passwordFromRequest, hashedPassword)) {
            return true;
        }

        return false;

    } catch (error) {
        console.log(error);
        throw error
    }
}

/**
 * Generate auth tokens
 *
 * @param email
 * @returns {{access_token: *, refresh_token: *}}
 */
function generateAuthTokens(email) {
    try {
        const accessToken = generateAccessToken({user: email});
        const refreshToken = generateRefreshToken({user: email});

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }

    } catch (error) {
        console.log(error);
        throw error
    }
}

class AuthService extends Service {

    /**
     * Generate password hash
     *
     * @param str
     * @returns {Promise<void|*>}
     */
    async generateHash(str) {

        try {
            return await bcrypt.hash(str, password_salt);

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Generate Tokens if password is verified
     *
     * @param email
     * @param passwordFromRequest
     * @param hashedPassword
     * @returns {Promise<{status, data}>}
     */
    async generateTokens(email, passwordFromRequest, hashedPassword) {

        try {
            const isValidPassword = await verifyPassword(passwordFromRequest, hashedPassword);
            if (isValidPassword === false) {
                return serviceResponse(
                    false,
                    {}
                );
            }

            const newTokens = generateAuthTokens(email);
            return serviceResponse(
                true,
                newTokens
            );

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Validate auth token
     *
     * @param token
     * @returns {*}
     */
    validateToken(token) {

        try {
            return jwt.verify(token, access_token_secret, (err, user) => {
                if (err) {

                    return serviceResponse(
                        false,
                        {},
                        "Token invalid or expired",
                        400
                    );

                } else {

                    return serviceResponse(
                        true,
                        user
                    );
                }
            });

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Refresh Auth tokens
     *
     * @param token
     * @returns {*}
     */
    refreshAuthTokens(token) {

        try {
            return jwt.verify(token, refresh_token_secret, (err, user) => {

                if (err) {

                    return serviceResponse(
                        false,
                        {},
                        "Token invalid or expired",
                        400
                    );

                } else {

                    const newTokens = generateAuthTokens(user.user);
                    return serviceResponse(
                        true,
                        newTokens
                    );
                }
            });

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService;