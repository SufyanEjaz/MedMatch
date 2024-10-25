module.exports = {

    default_ttl: 86400,

    development: {
        host: '127.0.0.1',
        port: '6379',
    },

    qa: {
        host: 'vcapture-mobile-app.ktnyo4.ng.0001.usw1.cache.amazonaws.com',
        port: '6379',
    },

    preprod: {
        host: 'vcapture-mobile-app.ktnyo4.ng.0001.usw1.cache.amazonaws.com',
        port: '6379',
    },

    production: {
        host: 'vcapture-mobile-app.ktnyo4.ng.0001.usw1.cache.amazonaws.com',
        port: '6379',
    },
};