class RequestHelper {

    static getQuery(req, key, defaultValue = '') {

        let value = req.query[key]
        if (value === undefined) {

            return defaultValue;
        }
        return value;
    }

    static getParam(req, key, defaultValue = '') {

        let value = req.params[key]
        if (value === undefined) {

            return defaultValue;
        }
        return value;
    }

    static getBody(req, key, defaultValue = '') {

        let value = req.body[key]
        if (value === undefined) {

            return defaultValue;
        }
        return value;
    }
}

module.exports = RequestHelper;